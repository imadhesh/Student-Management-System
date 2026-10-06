import { Grade, AssessmentType } from '../../types';
import { mysqlEngine } from '../../database/mysqlEngine';
import { jdbcPool } from '../JDBCConnection';

export class GradeDAO {
  public static getAllGrades(): Grade[] {
    const sql = "SELECT * FROM grades ORDER BY graded_at DESC";
    return jdbcPool.executePreparedStatement(
      'GradeDAO.getAllGrades()',
      sql,
      [],
      () => mysqlEngine.getGrades(),
      `String sql = "SELECT * FROM grades ORDER BY graded_at DESC";
try (Connection conn = DBConnection.getConnection();
     Statement stmt = conn.createStatement();
     ResultSet rs = stmt.executeQuery(sql)) {
    List<Grade> list = new ArrayList<>();
    while (rs.next()) list.add(mapResultSetToGrade(rs));
    return list;
}`
    );
  }

  public static getGradesByStudent(studentId: number): Grade[] {
    const sql = "SELECT * FROM grades WHERE student_id = ? ORDER BY graded_at DESC";
    return jdbcPool.executePreparedStatement(
      'GradeDAO.getGradesByStudent()',
      sql,
      [studentId],
      () => mysqlEngine.getGrades().filter(g => g.student_id === studentId),
      `String sql = "SELECT * FROM grades WHERE student_id = ? ORDER BY graded_at DESC";
try (Connection conn = DBConnection.getConnection();
     PreparedStatement pstmt = conn.prepareStatement(sql)) {
    pstmt.setInt(1, studentId);
    try (ResultSet rs = pstmt.executeQuery()) {
        List<Grade> list = new ArrayList<>();
        while (rs.next()) list.add(mapResultSetToGrade(rs));
        return list;
    }
}`
    );
  }

  public static getGradesByCourse(courseId: number): Grade[] {
    const sql = "SELECT * FROM grades WHERE course_id = ? ORDER BY graded_at DESC";
    return jdbcPool.executePreparedStatement(
      'GradeDAO.getGradesByCourse()',
      sql,
      [courseId],
      () => mysqlEngine.getGrades().filter(g => g.course_id === courseId),
      `String sql = "SELECT * FROM grades WHERE course_id = ? ORDER BY graded_at DESC";
try (Connection conn = DBConnection.getConnection();
     PreparedStatement pstmt = conn.prepareStatement(sql)) {
    pstmt.setInt(1, courseId);
    try (ResultSet rs = pstmt.executeQuery()) {
        List<Grade> list = new ArrayList<>();
        while (rs.next()) list.add(mapResultSetToGrade(rs));
        return list;
    }
}`
    );
  }

  public static computeLetterGrade(score: number, maxScore: number): string {
    const pct = (score / maxScore) * 100;
    if (pct >= 95) return 'A+';
    if (pct >= 90) return 'A';
    if (pct >= 85) return 'B+';
    if (pct >= 80) return 'B';
    if (pct >= 75) return 'C+';
    if (pct >= 70) return 'C';
    if (pct >= 60) return 'D';
    return 'F';
  }

  public static recordGrade(gradeInput: {
    student_id: number;
    course_id: number;
    assessment_type: AssessmentType;
    score: number;
    max_score: number;
    weightage: number;
    remarks?: string;
    graded_at: string;
  }): Grade {
    const letter_grade = this.computeLetterGrade(gradeInput.score, gradeInput.max_score);
    const sql = `INSERT INTO grades (student_id, course_id, assessment_type, score, max_score, weightage, letter_grade, remarks, graded_at) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      gradeInput.student_id,
      gradeInput.course_id,
      gradeInput.assessment_type,
      gradeInput.score,
      gradeInput.max_score,
      gradeInput.weightage,
      letter_grade,
      gradeInput.remarks || '',
      gradeInput.graded_at
    ];

    return jdbcPool.executePreparedStatement(
      'GradeDAO.recordGrade()',
      sql,
      params,
      () => mysqlEngine.insertGrade({
        ...gradeInput,
        letter_grade,
        remarks: gradeInput.remarks || ''
      }),
      `String sql = "INSERT INTO grades (student_id, course_id, assessment_type, score, max_score, weightage, letter_grade, remarks, graded_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
try (Connection conn = DBConnection.getConnection();
     PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
    pstmt.setInt(1, grade.getStudentId());
    pstmt.setInt(2, grade.getCourseId());
    pstmt.setString(3, grade.getAssessmentType());
    pstmt.setDouble(4, grade.getScore());
    pstmt.setDouble(5, grade.getMaxScore());
    pstmt.setDouble(6, grade.getWeightage());
    pstmt.setString(7, grade.getLetterGrade());
    pstmt.setString(8, grade.getRemarks());
    pstmt.setDate(9, Date.valueOf(grade.getGradedAt()));
    pstmt.executeUpdate();
}`
    );
  }

  public static batchRecordGrades(gradesList: Array<{
    student_id: number;
    course_id: number;
    assessment_type: AssessmentType;
    score: number;
    max_score: number;
    weightage: number;
    remarks?: string;
    graded_at: string;
  }>): number {
    const sql = `INSERT INTO grades (student_id, course_id, assessment_type, score, max_score, weightage, letter_grade, remarks, graded_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    return jdbcPool.executePreparedStatement(
      'GradeDAO.batchRecordGrades()',
      sql,
      [`Batch count: ${gradesList.length}`],
      () => {
        let count = 0;
        gradesList.forEach(g => {
          const letter = this.computeLetterGrade(g.score, g.max_score);
          mysqlEngine.insertGrade({ ...g, letter_grade: letter, remarks: g.remarks || '' });
          count++;
        });
        return count;
      },
      `String sql = "INSERT INTO grades (student_id, course_id, assessment_type, score, max_score, weightage, letter_grade, remarks, graded_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
try (Connection conn = DBConnection.getConnection()) {
    conn.setAutoCommit(false);
    try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
        for (Grade g : batchList) {
            pstmt.setInt(1, g.getStudentId());
            pstmt.setInt(2, g.getCourseId());
            pstmt.setString(3, g.getAssessmentType());
            pstmt.setDouble(4, g.getScore());
            pstmt.setDouble(5, g.getMaxScore());
            pstmt.setDouble(6, g.getWeightage());
            pstmt.setString(7, g.getLetterGrade());
            pstmt.setString(8, g.getRemarks());
            pstmt.setDate(9, Date.valueOf(g.getGradedAt()));
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

  public static deleteGrade(gradeId: number): boolean {
    const sql = `DELETE FROM grades WHERE grade_id = ?`;
    return jdbcPool.executePreparedStatement(
      'GradeDAO.deleteGrade()',
      sql,
      [gradeId],
      () => mysqlEngine.deleteGrade(gradeId),
      `String sql = "DELETE FROM grades WHERE grade_id = ?";
try (Connection conn = DBConnection.getConnection();
     PreparedStatement pstmt = conn.prepareStatement(sql)) {
    pstmt.setInt(1, gradeId);
    return pstmt.executeUpdate() > 0;
}`
    );
  }
}
