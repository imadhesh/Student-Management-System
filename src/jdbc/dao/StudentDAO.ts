import { Student } from '../../types';
import { mysqlEngine } from '../../database/mysqlEngine';
import { jdbcPool } from '../JDBCConnection';

export class StudentDAO {
  /**
   * Retrieves all students from MySQL database
   * Equivalent Java JDBC:
   * String sql = "SELECT * FROM students ORDER BY roll_number ASC";
   */
  public static getAllStudents(): Student[] {
    const sql = "SELECT * FROM students ORDER BY roll_number ASC";
    return jdbcPool.executePreparedStatement(
      'StudentDAO.getAllStudents()',
      sql,
      [],
      () => mysqlEngine.getStudents().sort((a, b) => a.roll_number.localeCompare(b.roll_number)),
      `String sql = "SELECT * FROM students ORDER BY roll_number ASC";
try (Connection conn = DBConnection.getConnection();
     Statement stmt = conn.createStatement();
     ResultSet rs = stmt.executeQuery(sql)) {
    List<Student> list = new ArrayList<>();
    while (rs.next()) {
        list.add(mapResultSetToStudent(rs));
    }
    return list;
}`
    );
  }

  public static getStudentById(id: number): Student | undefined {
    const sql = "SELECT * FROM students WHERE student_id = ?";
    return jdbcPool.executePreparedStatement(
      'StudentDAO.getStudentById()',
      sql,
      [id],
      () => mysqlEngine.getStudents().find(s => s.student_id === id),
      `String sql = "SELECT * FROM students WHERE student_id = ?";
try (Connection conn = DBConnection.getConnection();
     PreparedStatement pstmt = conn.prepareStatement(sql)) {
    pstmt.setInt(1, studentId);
    try (ResultSet rs = pstmt.executeQuery()) {
        if (rs.next()) {
            return mapResultSetToStudent(rs);
        }
    }
}`
    );
  }

  public static addStudent(student: Omit<Student, 'student_id'>): Student {
    const sql = `INSERT INTO students (roll_number, first_name, last_name, email, phone, department, semester, enrollment_date, status, gpa) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      student.roll_number,
      student.first_name,
      student.last_name,
      student.email,
      student.phone,
      student.department,
      student.semester,
      student.enrollment_date,
      student.status,
      student.gpa
    ];

    return jdbcPool.executePreparedStatement(
      'StudentDAO.addStudent()',
      sql,
      params,
      () => mysqlEngine.insertStudent(student),
      `String sql = "INSERT INTO students (roll_number, first_name, last_name, email, phone, department, semester, enrollment_date, status, gpa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
try (Connection conn = DBConnection.getConnection();
     PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
    pstmt.setString(1, student.getRollNumber());
    pstmt.setString(2, student.getFirstName());
    pstmt.setString(3, student.getLastName());
    pstmt.setString(4, student.getEmail());
    pstmt.setString(5, student.getPhone());
    pstmt.setString(6, student.getDepartment());
    pstmt.setInt(7, student.getSemester());
    pstmt.setDate(8, Date.valueOf(student.getEnrollmentDate()));
    pstmt.setString(9, student.getStatus());
    pstmt.setDouble(10, student.getGpa());
    pstmt.executeUpdate();
    try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
        if (generatedKeys.next()) {
            student.setStudentId(generatedKeys.getInt(1));
        }
    }
}`
    );
  }

  public static updateStudent(id: number, updates: Partial<Student>): boolean {
    const sql = `UPDATE students SET first_name = ?, last_name = ?, email = ?, phone = ?, department = ?, semester = ?, status = ? WHERE student_id = ?`;
    const params = [
      updates.first_name ?? '',
      updates.last_name ?? '',
      updates.email ?? '',
      updates.phone ?? '',
      updates.department ?? '',
      updates.semester ?? 1,
      updates.status ?? 'ACTIVE',
      id
    ];

    return jdbcPool.executePreparedStatement(
      'StudentDAO.updateStudent()',
      sql,
      params,
      () => mysqlEngine.updateStudent(id, updates),
      `String sql = "UPDATE students SET first_name = ?, last_name = ?, email = ?, phone = ?, department = ?, semester = ?, status = ? WHERE student_id = ?";
try (Connection conn = DBConnection.getConnection();
     PreparedStatement pstmt = conn.prepareStatement(sql)) {
    pstmt.setString(1, student.getFirstName());
    pstmt.setString(2, student.getLastName());
    pstmt.setString(3, student.getEmail());
    pstmt.setString(4, student.getPhone());
    pstmt.setString(5, student.getDepartment());
    pstmt.setInt(6, student.getSemester());
    pstmt.setString(7, student.getStatus());
    pstmt.setInt(8, student.getStudentId());
    return pstmt.executeUpdate() > 0;
}`
    );
  }

  public static deleteStudent(id: number): boolean {
    const sql = `DELETE FROM students WHERE student_id = ?`;
    return jdbcPool.executePreparedStatement(
      'StudentDAO.deleteStudent()',
      sql,
      [id],
      () => mysqlEngine.deleteStudent(id),
      `String sql = "DELETE FROM students WHERE student_id = ?";
try (Connection conn = DBConnection.getConnection();
     PreparedStatement pstmt = conn.prepareStatement(sql)) {
    pstmt.setInt(1, studentId);
    return pstmt.executeUpdate() > 0;
}`
    );
  }
}
