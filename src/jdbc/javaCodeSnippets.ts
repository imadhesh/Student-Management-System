export interface JavaFileItem {
  filename: string;
  path: string;
  description: string;
  language: string;
  code: string;
}

export const JAVA_PROJECT_FILES: JavaFileItem[] = [
  {
    filename: 'pom.xml',
    path: 'pom.xml',
    description: 'Maven Project Object Model with MySQL Connector/J dependency',
    language: 'xml',
    code: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.university</groupId>
    <artifactId>student-management-system</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>StudentSphere Management System</name>
    <description>Enterprise Student Management System with JDBC and MySQL</description>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <mysql.version>8.3.0</mysql.version>
    </properties>

    <dependencies>
        <!-- MySQL JDBC Driver -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <version>\${mysql.version}</version>
        </dependency>

        <!-- HikariCP Connection Pool (Optional high-performance pooling) -->
        <dependency>
            <groupId>com.zaxxer</groupId>
            <artifactId>HikariCP</artifactId>
            <version>5.1.0</version>
        </dependency>

        <!-- SLF4J Simple Logger -->
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-simple</artifactId>
            <version>2.0.12</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>3.5.1</version>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>shade</goal>
                        </goals>
                        <configuration>
                            <transformers>
                                <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                                    <mainClass>com.university.Main</mainClass>
                                </transformer>
                            </transformers>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>`
  },
  {
    filename: 'schema.sql',
    path: 'src/main/resources/schema.sql',
    description: 'Complete MySQL DDL & DML database initialization script',
    language: 'sql',
    code: `-- ========================================================
-- Database: student_management_db
-- Target Engine: MySQL 8.0+ / InnoDB
-- Character Set: utf8mb4 / Collation: utf8mb4_unicode_ci
-- ========================================================

CREATE DATABASE IF NOT EXISTS student_management_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE student_management_db;

-- 1. Table: students
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS grades;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;

CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    roll_number VARCHAR(20) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    department VARCHAR(50) NOT NULL,
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
    enrollment_date DATE NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
    gpa DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_department (department),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- 2. Table: courses
CREATE TABLE courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(15) NOT NULL UNIQUE,
    course_name VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    credits INT NOT NULL CHECK (credits BETWEEN 1 AND 6),
    instructor VARCHAR(80) NOT NULL,
    semester INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_course_code (course_code)
) ENGINE=InnoDB;

-- 3. Table: enrollments
CREATE TABLE enrollments (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrollment_date DATE NOT NULL,
    academic_term VARCHAR(20) NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    UNIQUE KEY uq_student_course_term (student_id, course_id, academic_term)
) ENGINE=InnoDB;

-- 4. Table: grades
CREATE TABLE grades (
    grade_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    assessment_type VARCHAR(30) NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    max_score DECIMAL(5,2) NOT NULL DEFAULT 100.00,
    weightage DECIMAL(5,2) NOT NULL DEFAULT 20.00,
    letter_grade VARCHAR(2) NOT NULL,
    remarks VARCHAR(255),
    graded_at DATE NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    INDEX idx_student_grade (student_id),
    INDEX idx_course_grade (course_id)
) ENGINE=InnoDB;

-- 5. Table: attendance
CREATE TABLE attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    session_date DATE NOT NULL,
    status ENUM('PRESENT', 'ABSENT', 'LATE', 'EXCUSED') DEFAULT 'PRESENT',
    remarks VARCHAR(100),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    UNIQUE KEY uq_attendance_entry (student_id, course_id, session_date),
    INDEX idx_session_date (session_date)
) ENGINE=InnoDB;

-- Seed Sample Data
INSERT INTO students (roll_number, first_name, last_name, email, phone, department, semester, enrollment_date, status, gpa) VALUES
('CS-2024-001', 'Alexander', 'Hayes', 'alexander.hayes@university.edu', '+1 (555) 234-5678', 'Computer Science', 3, '2024-08-15', 'ACTIVE', 3.85),
('CS-2024-002', 'Sophia', 'Nguyen', 'sophia.nguyen@university.edu', '+1 (555) 345-6789', 'Computer Science', 3, '2024-08-15', 'ACTIVE', 3.92),
('IT-2024-015', 'Liam', 'O\'Connor', 'liam.oconnor@university.edu', '+1 (555) 456-7890', 'Information Technology', 5, '2023-08-20', 'ACTIVE', 3.25),
('DS-2024-008', 'Maya', 'Patel', 'maya.patel@university.edu', '+1 (555) 567-8901', 'Data Science', 4, '2024-01-10', 'ACTIVE', 3.70),
('EE-2024-021', 'Lucas', 'Morales', 'lucas.morales@university.edu', '+1 (555) 678-9012', 'Electrical Engineering', 4, '2024-01-10', 'ACTIVE', 1.95);

INSERT INTO courses (course_code, course_name, department, credits, instructor, semester) VALUES
('CS201', 'Database Management Systems & SQL', 'Computer Science', 4, 'Dr. Robert Martinez', 3),
('CS302', 'Object-Oriented Programming with Java', 'Computer Science', 4, 'Prof. Katherine Vance', 3),
('DS210', 'Data Structures & Algorithms', 'Data Science', 3, 'Dr. Ananya Sharma', 4),
('EE205', 'Digital Logic & Microprocessors', 'Electrical Engineering', 4, 'Prof. Marcus Chen', 4);
`
  },
  {
    filename: 'DBConnection.java',
    path: 'src/main/java/com/university/util/DBConnection.java',
    description: 'JDBC connection factory with DriverManager and connection validation',
    language: 'java',
    code: `package com.university.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Manages database connectivity via standard JDBC API.
 */
public class DBConnection {
    private static final String URL = System.getenv().getOrDefault(
        "DB_URL", "jdbc:mysql://localhost:3306/student_management_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
    );
    private static final String USER = System.getenv().getOrDefault("DB_USER", "root");
    private static final String PASSWORD = System.getenv().getOrDefault("DB_PASSWORD", "rootpassword");

    static {
        try {
            // Explicitly load MySQL JDBC Driver
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("MySQL JDBC Driver not found. Ensure mysql-connector-j is in classpath.", e);
        }
    }

    private DBConnection() {
        // Prevent instantiation
    }

    /**
     * Obtains an open JDBC Connection to the MySQL database.
     * @return active java.sql.Connection
     * @throws SQLException on connection failure
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }

    /**
     * Verifies that the MySQL server is reachable.
     */
    public static boolean testConnection() {
        try (Connection conn = getConnection()) {
            return conn != null && !conn.isClosed();
        } catch (SQLException e) {
            System.err.println("Connection test failed: " + e.getMessage());
            return false;
        }
    }
}`
  },
  {
    filename: 'Student.java',
    path: 'src/main/java/com/university/model/Student.java',
    description: 'Plain Old Java Object (POJO) representing a student record',
    language: 'java',
    code: `package com.university.model;

import java.time.LocalDate;

public class Student {
    private int studentId;
    private String rollNumber;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String department;
    private int semester;
    private LocalDate enrollmentDate;
    private String status;
    private double gpa;

    public Student() {}

    public Student(String rollNumber, String firstName, String lastName, String email, 
                   String phone, String department, int semester, LocalDate enrollmentDate, 
                   String status, double gpa) {
        this.rollNumber = rollNumber;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.semester = semester;
        this.enrollmentDate = enrollmentDate;
        this.status = status;
        this.gpa = gpa;
    }

    // Getters and Setters
    public int getStudentId() { return studentId; }
    public void setStudentId(int studentId) { this.studentId = studentId; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getFullName() { return firstName + " " + lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }

    public LocalDate getEnrollmentDate() { return enrollmentDate; }
    public void setEnrollmentDate(LocalDate enrollmentDate) { this.enrollmentDate = enrollmentDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public double getGpa() { return gpa; }
    public void setGpa(double gpa) { this.gpa = gpa; }

    @Override
    public String toString() {
        return String.format("[%s] %s (%s, Sem %d, GPA: %.2f)", rollNumber, getFullName(), department, semester, gpa);
    }
}`
  },
  {
    filename: 'StudentDAO.java',
    path: 'src/main/java/com/university/dao/StudentDAO.java',
    description: 'Data Access Object for Student CRUD operations via JDBC PreparedStatements',
    language: 'java',
    code: `package com.university.dao;

import com.university.model.Student;
import com.university.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class StudentDAO {

    public List<Student> getAllStudents() throws SQLException {
        String sql = "SELECT * FROM students ORDER BY roll_number ASC";
        List<Student> students = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                students.add(mapResultSetToStudent(rs));
            }
        }
        return students;
    }

    public Optional<Student> getStudentById(int studentId) throws SQLException {
        String sql = "SELECT * FROM students WHERE student_id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, studentId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToStudent(rs));
                }
            }
        }
        return Optional.empty();
    }

    public int addStudent(Student student) throws SQLException {
        String sql = "INSERT INTO students (roll_number, first_name, last_name, email, phone, "
                   + "department, semester, enrollment_date, status, gpa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

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

            int affectedRows = pstmt.executeUpdate();
            if (affectedRows > 0) {
                try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        student.setStudentId(generatedKeys.getInt(1));
                    }
                }
            }
            return student.getStudentId();
        }
    }

    public boolean updateStudent(Student student) throws SQLException {
        String sql = "UPDATE students SET first_name = ?, last_name = ?, email = ?, phone = ?, "
                   + "department = ?, semester = ?, status = ? WHERE student_id = ?";

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
        }
    }

    public boolean deleteStudent(int studentId) throws SQLException {
        String sql = "DELETE FROM students WHERE student_id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, studentId);
            return pstmt.executeUpdate() > 0;
        }
    }

    private Student mapResultSetToStudent(ResultSet rs) throws SQLException {
        Student s = new Student();
        s.setStudentId(rs.getInt("student_id"));
        s.setRollNumber(rs.getString("roll_number"));
        s.setFirstName(rs.getString("first_name"));
        s.setLastName(rs.getString("last_name"));
        s.setEmail(rs.getString("email"));
        s.setPhone(rs.getString("phone"));
        s.setDepartment(rs.getString("department"));
        s.setSemester(rs.getInt("semester"));
        s.setEnrollmentDate(rs.getDate("enrollment_date").toLocalDate());
        s.setStatus(rs.getString("status"));
        s.setGpa(rs.getDouble("gpa"));
        return s;
    }
}`
  },
  {
    filename: 'GradeDAO.java',
    path: 'src/main/java/com/university/dao/GradeDAO.java',
    description: 'Data Access Object for recording scores and computing GPA',
    language: 'java',
    code: `package com.university.dao;

import com.university.model.Grade;
import com.university.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class GradeDAO {

    public int recordGrade(Grade grade) throws SQLException {
        String sql = "INSERT INTO grades (student_id, course_id, assessment_type, score, max_score, "
                   + "weightage, letter_grade, remarks, graded_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

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
            try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    grade.setGradeId(generatedKeys.getInt(1));
                }
            }
            updateStudentGpa(conn, grade.getStudentId());
            return grade.getGradeId();
        }
    }

    public int[] batchRecordGrades(List<Grade> grades) throws SQLException {
        String sql = "INSERT INTO grades (student_id, course_id, assessment_type, score, max_score, "
                   + "weightage, letter_grade, remarks, graded_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection()) {
            conn.setAutoCommit(false);
            try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
                for (Grade g : grades) {
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
                return results;
            } catch (SQLException ex) {
                conn.rollback();
                throw ex;
            }
        }
    }

    private void updateStudentGpa(Connection conn, int studentId) throws SQLException {
        String gpaQuery = "SELECT AVG((score / max_score) * 4.0) as calculated_gpa FROM grades WHERE student_id = ?";
        String updateQuery = "UPDATE students SET gpa = ? WHERE student_id = ?";

        double gpa = 0.0;
        try (PreparedStatement qStmt = conn.prepareStatement(gpaQuery)) {
            qStmt.setInt(1, studentId);
            try (ResultSet rs = qStmt.executeQuery()) {
                if (rs.next()) {
                    gpa = rs.getDouble("calculated_gpa");
                }
            }
        }

        try (PreparedStatement uStmt = conn.prepareStatement(updateQuery)) {
            uStmt.setDouble(1, Math.round(gpa * 100.0) / 100.0);
            uStmt.setInt(2, studentId);
            uStmt.executeUpdate();
        }
    }
}`
  },
  {
    filename: 'AttendanceDAO.java',
    path: 'src/main/java/com/university/dao/AttendanceDAO.java',
    description: 'Data Access Object for daily attendance tracking and threshold alerts',
    language: 'java',
    code: `package com.university.dao;

import com.university.model.Attendance;
import com.university.util.DBConnection;

import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class AttendanceDAO {

    public boolean recordAttendance(Attendance attendance) throws SQLException {
        String sql = "INSERT INTO attendance (student_id, course_id, session_date, status, remarks) "
                   + "VALUES (?, ?, ?, ?, ?) "
                   + "ON DUPLICATE KEY UPDATE status = VALUES(status), remarks = VALUES(remarks)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, attendance.getStudentId());
            pstmt.setInt(2, attendance.getCourseId());
            pstmt.setDate(3, Date.valueOf(attendance.getSessionDate()));
            pstmt.setString(4, attendance.getStatus());
            pstmt.setString(5, attendance.getRemarks());

            return pstmt.executeUpdate() > 0;
        }
    }

    public double getAttendancePercentage(int studentId, int courseId) throws SQLException {
        String sql = "SELECT "
                   + "COUNT(*) as total_sessions, "
                   + "SUM(CASE WHEN status = 'PRESENT' THEN 1 WHEN status = 'LATE' THEN 0.5 ELSE 0 END) as attended "
                   + "FROM attendance WHERE student_id = ? AND course_id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, studentId);
            pstmt.setInt(2, courseId);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    int total = rs.getInt("total_sessions");
                    double attended = rs.getDouble("attended");
                    if (total == 0) return 100.0;
                    return (attended / total) * 100.0;
                }
            }
        }
        return 100.0;
    }
}`
  },
  {
    filename: 'Main.java',
    path: 'src/main/java/com/university/Main.java',
    description: 'Application Entry Point showing JDBC startup sequence and test runner',
    language: 'java',
    code: `package com.university;

import com.university.dao.StudentDAO;
import com.university.model.Student;
import com.university.util.DBConnection;

import java.sql.SQLException;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("   StudentSphere - JDBC & MySQL Management System ");
        System.out.println("==================================================");

        if (!DBConnection.testConnection()) {
            System.err.println("[ERROR] Unable to connect to MySQL database.");
            System.err.println("Verify MySQL server is running on localhost:3306");
            return;
        }

        System.out.println("[OK] Connected to MySQL via com.mysql.cj.jdbc.Driver");

        StudentDAO studentDAO = new StudentDAO();
        try {
            List<Student> students = studentDAO.getAllStudents();
            System.out.println("Found " + students.size() + " active student records:");
            for (Student s : students) {
                System.out.println("  • " + s);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}`
  }
];
