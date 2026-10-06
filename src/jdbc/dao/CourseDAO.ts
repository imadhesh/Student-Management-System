import { Course } from '../../types';
import { mysqlEngine } from '../../database/mysqlEngine';
import { jdbcPool } from '../JDBCConnection';

export class CourseDAO {
  public static getAllCourses(): Course[] {
    const sql = "SELECT * FROM courses ORDER BY course_code ASC";
    return jdbcPool.executePreparedStatement(
      'CourseDAO.getAllCourses()',
      sql,
      [],
      () => mysqlEngine.getCourses().sort((a, b) => a.course_code.localeCompare(b.course_code)),
      `String sql = "SELECT * FROM courses ORDER BY course_code ASC";
try (Connection conn = DBConnection.getConnection();
     Statement stmt = conn.createStatement();
     ResultSet rs = stmt.executeQuery(sql)) {
    List<Course> list = new ArrayList<>();
    while (rs.next()) {
        list.add(mapResultSetToCourse(rs));
    }
    return list;
}`
    );
  }

  public static getCourseById(id: number): Course | undefined {
    const sql = "SELECT * FROM courses WHERE course_id = ?";
    return jdbcPool.executePreparedStatement(
      'CourseDAO.getCourseById()',
      sql,
      [id],
      () => mysqlEngine.getCourses().find(c => c.course_id === id),
      `String sql = "SELECT * FROM courses WHERE course_id = ?";
try (Connection conn = DBConnection.getConnection();
     PreparedStatement pstmt = conn.prepareStatement(sql)) {
    pstmt.setInt(1, courseId);
    try (ResultSet rs = pstmt.executeQuery()) {
        if (rs.next()) return mapResultSetToCourse(rs);
    }
}`
    );
  }

  public static addCourse(course: Omit<Course, 'course_id'>): Course {
    const sql = `INSERT INTO courses (course_code, course_name, department, credits, instructor, semester) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [
      course.course_code,
      course.course_name,
      course.department,
      course.credits,
      course.instructor,
      course.semester
    ];

    return jdbcPool.executePreparedStatement(
      'CourseDAO.addCourse()',
      sql,
      params,
      () => mysqlEngine.insertCourse(course),
      `String sql = "INSERT INTO courses (course_code, course_name, department, credits, instructor, semester) VALUES (?, ?, ?, ?, ?, ?)";
try (Connection conn = DBConnection.getConnection();
     PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
    pstmt.setString(1, course.getCourseCode());
    pstmt.setString(2, course.getCourseName());
    pstmt.setString(3, course.getDepartment());
    pstmt.setInt(4, course.getCredits());
    pstmt.setString(5, course.getInstructor());
    pstmt.setInt(6, course.getSemester());
    pstmt.executeUpdate();
}`
    );
  }

  public static deleteCourse(id: number): boolean {
    const sql = `DELETE FROM courses WHERE course_id = ?`;
    return jdbcPool.executePreparedStatement(
      'CourseDAO.deleteCourse()',
      sql,
      [id],
      () => mysqlEngine.deleteCourse(id),
      `String sql = "DELETE FROM courses WHERE course_id = ?";
try (Connection conn = DBConnection.getConnection();
     PreparedStatement pstmt = conn.prepareStatement(sql)) {
    pstmt.setInt(1, courseId);
    return pstmt.executeUpdate() > 0;
}`
    );
  }
}
