import { Attendance, AttendanceStatus } from '../../types';
import { mysqlEngine } from '../../database/mysqlEngine';
import { jdbcPool } from '../JDBCConnection';

export interface StudentAttendanceSummary {
  student_id: number;
  total_sessions: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  excused_count: number;
  attendance_percentage: number;
  is_at_risk: boolean; // attendance < 75%
}

export class AttendanceDAO {
  public static getAllAttendance(): Attendance[] {
    const sql = "SELECT * FROM attendance ORDER BY session_date DESC";
    return jdbcPool.executePreparedStatement(
      'AttendanceDAO.getAllAttendance()',
      sql,
      [],
      () => mysqlEngine.getAttendance(),
      `String sql = "SELECT * FROM attendance ORDER BY session_date DESC";
try (Connection conn = DBConnection.getConnection();
     Statement stmt = conn.createStatement();
     ResultSet rs = stmt.executeQuery(sql)) {
    List<Attendance> list = new ArrayList<>();
    while (rs.next()) list.add(mapResultSetToAttendance(rs));
    return list;
}`
    );
  }

  public static getAttendanceByCourseAndDate(courseId: number, date: string): Attendance[] {
    const sql = "SELECT * FROM attendance WHERE course_id = ? AND session_date = ?";
    return jdbcPool.executePreparedStatement(
      'AttendanceDAO.getAttendanceByCourseAndDate()',
      sql,
      [courseId, date],
      () => mysqlEngine.getAttendance().filter(a => a.course_id === courseId && a.session_date === date),
      `String sql = "SELECT * FROM attendance WHERE course_id = ? AND session_date = ?";
try (Connection conn = DBConnection.getConnection();
     PreparedStatement pstmt = conn.prepareStatement(sql)) {
    pstmt.setInt(1, courseId);
    pstmt.setDate(2, Date.valueOf(sessionDate));
    try (ResultSet rs = pstmt.executeQuery()) {
        List<Attendance> list = new ArrayList<>();
        while (rs.next()) list.add(mapResultSetToAttendance(rs));
        return list;
    }
}`
    );
  }

  public static getAttendanceByStudent(studentId: number): Attendance[] {
    const sql = "SELECT * FROM attendance WHERE student_id = ? ORDER BY session_date DESC";
    return jdbcPool.executePreparedStatement(
      'AttendanceDAO.getAttendanceByStudent()',
      sql,
      [studentId],
      () => mysqlEngine.getAttendance().filter(a => a.student_id === studentId),
      `String sql = "SELECT * FROM attendance WHERE student_id = ? ORDER BY session_date DESC";
try (Connection conn = DBConnection.getConnection();
     PreparedStatement pstmt = conn.prepareStatement(sql)) {
    pstmt.setInt(1, studentId);
    try (ResultSet rs = pstmt.executeQuery()) {
        List<Attendance> list = new ArrayList<>();
        while (rs.next()) list.add(mapResultSetToAttendance(rs));
        return list;
    }
}`
    );
  }

  public static recordAttendance(record: {
    student_id: number;
    course_id: number;
    session_date: string;
    status: AttendanceStatus;
    remarks?: string;
  }): Attendance {
    const sql = `INSERT INTO attendance (student_id, course_id, session_date, status, remarks) 
VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE status = VALUES(status), remarks = VALUES(remarks)`;
    const params = [
      record.student_id,
      record.course_id,
      record.session_date,
      record.status,
      record.remarks || ''
    ];

    return jdbcPool.executePreparedStatement(
      'AttendanceDAO.recordAttendance()',
      sql,
      params,
      () => mysqlEngine.insertAttendance({
        ...record,
        remarks: record.remarks || ''
      }),
      `String sql = "INSERT INTO attendance (student_id, course_id, session_date, status, remarks) "
            + "VALUES (?, ?, ?, ?, ?) "
            + "ON DUPLICATE KEY UPDATE status = VALUES(status), remarks = VALUES(remarks)";
try (Connection conn = DBConnection.getConnection();
     PreparedStatement pstmt = conn.prepareStatement(sql)) {
    pstmt.setInt(1, record.getStudentId());
    pstmt.setInt(2, record.getCourseId());
    pstmt.setDate(3, Date.valueOf(record.getSessionDate()));
    pstmt.setString(4, record.getStatus().name());
    pstmt.setString(5, record.getRemarks());
    pstmt.executeUpdate();
}`
    );
  }

  public static batchRecordAttendance(records: Array<{
    student_id: number;
    course_id: number;
    session_date: string;
    status: AttendanceStatus;
    remarks?: string;
  }>): number {
    const sql = `INSERT INTO attendance (student_id, course_id, session_date, status, remarks) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE status = VALUES(status)`;

    return jdbcPool.executePreparedStatement(
      'AttendanceDAO.batchRecordAttendance()',
      sql,
      [`Batch count: ${records.length}`, records[0]?.session_date || 'N/A'],
      () => mysqlEngine.batchUpsertAttendance(records.map(r => ({ ...r, remarks: r.remarks || '' }))),
      `String sql = "INSERT INTO attendance (student_id, course_id, session_date, status, remarks) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE status = VALUES(status)";
try (Connection conn = DBConnection.getConnection()) {
    conn.setAutoCommit(false);
    try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
        for (Attendance a : attendanceList) {
            pstmt.setInt(1, a.getStudentId());
            pstmt.setInt(2, a.getCourseId());
            pstmt.setDate(3, Date.valueOf(a.getSessionDate()));
            pstmt.setString(4, a.getStatus().name());
            pstmt.setString(5, a.getRemarks());
            pstmt.addBatch();
        }
        int[] results = pstmt.executeBatch();
        conn.commit();
        return results.length;
    } catch (SQLException ex) {
        conn.rollback();
        throw ex;
    }
}`
    );
  }

  public static getStudentAttendanceSummary(studentId: number): StudentAttendanceSummary {
    const records = mysqlEngine.getAttendance().filter(a => a.student_id === studentId);
    const total = records.length;
    const present = records.filter(a => a.status === 'PRESENT').length;
    const absent = records.filter(a => a.status === 'ABSENT').length;
    const late = records.filter(a => a.status === 'LATE').length;
    const excused = records.filter(a => a.status === 'EXCUSED').length;

    // Weighting: PRESENT = 1.0, LATE = 0.5, EXCUSED = 1.0 (doesn't penalize)
    const effectivePresent = present + late * 0.5 + excused;
    const pct = total > 0 ? Math.round((effectivePresent / total) * 100) : 100;

    return {
      student_id: studentId,
      total_sessions: total,
      present_count: present,
      absent_count: absent,
      late_count: late,
      excused_count: excused,
      attendance_percentage: pct,
      is_at_risk: pct < 75 && total >= 3
    };
  }

  public static getOverallAttendanceRate(): number {
    const all = mysqlEngine.getAttendance();
    if (all.length === 0) return 100;
    const presentOrExcused = all.filter(a => a.status === 'PRESENT' || a.status === 'EXCUSED').length;
    const late = all.filter(a => a.status === 'LATE').length;
    return Math.round(((presentOrExcused + late * 0.5) / all.length) * 100);
  }
}
