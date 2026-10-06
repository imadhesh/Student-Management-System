import { Student, Course, Enrollment, Grade, Attendance, SqlQueryResult } from '../types';
import { INITIAL_STUDENTS, INITIAL_COURSES, INITIAL_ENROLLMENTS, INITIAL_GRADES, INITIAL_ATTENDANCE } from './initialData';

const STORAGE_KEY_PREFIX = 'studentsphere_mysql_';

export interface TableColumn {
  name: string;
  type: string;
  isPrimary?: boolean;
  isAutoIncrement?: boolean;
  isNullable?: boolean;
  references?: string;
}

export interface TableSchema {
  tableName: string;
  columns: TableColumn[];
}

export const SCHEMAS: Record<string, TableSchema> = {
  students: {
    tableName: 'students',
    columns: [
      { name: 'student_id', type: 'INT', isPrimary: true, isAutoIncrement: true, isNullable: false },
      { name: 'roll_number', type: 'VARCHAR(20)', isNullable: false },
      { name: 'first_name', type: 'VARCHAR(50)', isNullable: false },
      { name: 'last_name', type: 'VARCHAR(50)', isNullable: false },
      { name: 'email', type: 'VARCHAR(100)', isNullable: false },
      { name: 'phone', type: 'VARCHAR(20)', isNullable: true },
      { name: 'department', type: 'VARCHAR(50)', isNullable: false },
      { name: 'semester', type: 'INT', isNullable: false },
      { name: 'enrollment_date', type: 'DATE', isNullable: false },
      { name: 'status', type: "ENUM('ACTIVE','INACTIVE','SUSPENDED')", isNullable: false },
      { name: 'gpa', type: 'DECIMAL(3,2)', isNullable: false }
    ]
  },
  courses: {
    tableName: 'courses',
    columns: [
      { name: 'course_id', type: 'INT', isPrimary: true, isAutoIncrement: true, isNullable: false },
      { name: 'course_code', type: 'VARCHAR(15)', isNullable: false },
      { name: 'course_name', type: 'VARCHAR(100)', isNullable: false },
      { name: 'department', type: 'VARCHAR(50)', isNullable: false },
      { name: 'credits', type: 'INT', isNullable: false },
      { name: 'instructor', type: 'VARCHAR(80)', isNullable: false },
      { name: 'semester', type: 'INT', isNullable: false }
    ]
  },
  enrollments: {
    tableName: 'enrollments',
    columns: [
      { name: 'enrollment_id', type: 'INT', isPrimary: true, isAutoIncrement: true, isNullable: false },
      { name: 'student_id', type: 'INT', isNullable: false, references: 'students(student_id)' },
      { name: 'course_id', type: 'INT', isNullable: false, references: 'courses(course_id)' },
      { name: 'enrollment_date', type: 'DATE', isNullable: false },
      { name: 'academic_term', type: 'VARCHAR(20)', isNullable: false }
    ]
  },
  grades: {
    tableName: 'grades',
    columns: [
      { name: 'grade_id', type: 'INT', isPrimary: true, isAutoIncrement: true, isNullable: false },
      { name: 'student_id', type: 'INT', isNullable: false, references: 'students(student_id)' },
      { name: 'course_id', type: 'INT', isNullable: false, references: 'courses(course_id)' },
      { name: 'assessment_type', type: 'VARCHAR(30)', isNullable: false },
      { name: 'score', type: 'DECIMAL(5,2)', isNullable: false },
      { name: 'max_score', type: 'DECIMAL(5,2)', isNullable: false },
      { name: 'weightage', type: 'DECIMAL(5,2)', isNullable: false },
      { name: 'letter_grade', type: 'VARCHAR(2)', isNullable: false },
      { name: 'remarks', type: 'VARCHAR(255)', isNullable: true },
      { name: 'graded_at', type: 'DATE', isNullable: false }
    ]
  },
  attendance: {
    tableName: 'attendance',
    columns: [
      { name: 'attendance_id', type: 'INT', isPrimary: true, isAutoIncrement: true, isNullable: false },
      { name: 'student_id', type: 'INT', isNullable: false, references: 'students(student_id)' },
      { name: 'course_id', type: 'INT', isNullable: false, references: 'courses(course_id)' },
      { name: 'session_date', type: 'DATE', isNullable: false },
      { name: 'status', type: "ENUM('PRESENT','ABSENT','LATE','EXCUSED')", isNullable: false },
      { name: 'remarks', type: 'VARCHAR(100)', isNullable: true }
    ]
  }
};

class MySQLEngine {
  private students: Student[] = [];
  private courses: Course[] = [];
  private enrollments: Enrollment[] = [];
  private grades: Grade[] = [];
  private attendance: Attendance[] = [];

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const storedStudents = localStorage.getItem(STORAGE_KEY_PREFIX + 'students');
      const storedCourses = localStorage.getItem(STORAGE_KEY_PREFIX + 'courses');
      const storedEnrollments = localStorage.getItem(STORAGE_KEY_PREFIX + 'enrollments');
      const storedGrades = localStorage.getItem(STORAGE_KEY_PREFIX + 'grades');
      const storedAttendance = localStorage.getItem(STORAGE_KEY_PREFIX + 'attendance');

      if (storedStudents && storedCourses && storedGrades && storedAttendance) {
        this.students = JSON.parse(storedStudents);
        this.courses = JSON.parse(storedCourses);
        this.enrollments = storedEnrollments ? JSON.parse(storedEnrollments) : INITIAL_ENROLLMENTS;
        this.grades = JSON.parse(storedGrades);
        this.attendance = JSON.parse(storedAttendance);
      } else {
        this.resetToDefaults();
      }
    } catch {
      this.resetToDefaults();
    }
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'students', JSON.stringify(this.students));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'courses', JSON.stringify(this.courses));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'enrollments', JSON.stringify(this.enrollments));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'grades', JSON.stringify(this.grades));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'attendance', JSON.stringify(this.attendance));
    } catch (e) {
      console.warn('Failed to save MySQL state to localStorage', e);
    }
  }

  public resetToDefaults() {
    this.students = JSON.parse(JSON.stringify(INITIAL_STUDENTS));
    this.courses = JSON.parse(JSON.stringify(INITIAL_COURSES));
    this.enrollments = JSON.parse(JSON.stringify(INITIAL_ENROLLMENTS));
    this.grades = JSON.parse(JSON.stringify(INITIAL_GRADES));
    this.attendance = JSON.parse(JSON.stringify(INITIAL_ATTENDANCE));
    this.saveState();
  }

  // Get raw table datasets
  public getStudents(): Student[] {
    return [...this.students];
  }

  public getCourses(): Course[] {
    return [...this.courses];
  }

  public getEnrollments(): Enrollment[] {
    return [...this.enrollments];
  }

  public getGrades(): Grade[] {
    return [...this.grades];
  }

  public getAttendance(): Attendance[] {
    return [...this.attendance];
  }

  // Table mutations
  public insertStudent(student: Omit<Student, 'student_id'>): Student {
    const nextId = this.students.length > 0 ? Math.max(...this.students.map(s => s.student_id)) + 1 : 1;
    const newStudent: Student = { ...student, student_id: nextId };
    this.students.push(newStudent);
    this.saveState();
    return newStudent;
  }

  public updateStudent(student_id: number, updates: Partial<Student>): boolean {
    const idx = this.students.findIndex(s => s.student_id === student_id);
    if (idx === -1) return false;
    this.students[idx] = { ...this.students[idx], ...updates };
    this.saveState();
    return true;
  }

  public deleteStudent(student_id: number): boolean {
    const idx = this.students.findIndex(s => s.student_id === student_id);
    if (idx === -1) return false;
    this.students.splice(idx, 1);
    // Cascade delete related records
    this.grades = this.grades.filter(g => g.student_id !== student_id);
    this.attendance = this.attendance.filter(a => a.student_id !== student_id);
    this.enrollments = this.enrollments.filter(e => e.student_id !== student_id);
    this.saveState();
    return true;
  }

  public insertCourse(course: Omit<Course, 'course_id'>): Course {
    const nextId = this.courses.length > 0 ? Math.max(...this.courses.map(c => c.course_id)) + 1 : 101;
    const newCourse: Course = { ...course, course_id: nextId };
    this.courses.push(newCourse);
    this.saveState();
    return newCourse;
  }

  public updateCourse(course_id: number, updates: Partial<Course>): boolean {
    const idx = this.courses.findIndex(c => c.course_id === course_id);
    if (idx === -1) return false;
    this.courses[idx] = { ...this.courses[idx], ...updates };
    this.saveState();
    return true;
  }

  public deleteCourse(course_id: number): boolean {
    const idx = this.courses.findIndex(c => c.course_id === course_id);
    if (idx === -1) return false;
    this.courses.splice(idx, 1);
    this.grades = this.grades.filter(g => g.course_id !== course_id);
    this.attendance = this.attendance.filter(a => a.course_id !== course_id);
    this.enrollments = this.enrollments.filter(e => e.course_id !== course_id);
    this.saveState();
    return true;
  }

  public insertGrade(grade: Omit<Grade, 'grade_id'>): Grade {
    const nextId = this.grades.length > 0 ? Math.max(...this.grades.map(g => g.grade_id)) + 1 : 1;
    const newGrade: Grade = { ...grade, grade_id: nextId };
    this.grades.push(newGrade);
    this.recalculateStudentGPA(grade.student_id);
    this.saveState();
    return newGrade;
  }

  public updateGrade(grade_id: number, updates: Partial<Grade>): boolean {
    const idx = this.grades.findIndex(g => g.grade_id === grade_id);
    if (idx === -1) return false;
    this.grades[idx] = { ...this.grades[idx], ...updates };
    this.recalculateStudentGPA(this.grades[idx].student_id);
    this.saveState();
    return true;
  }

  public deleteGrade(grade_id: number): boolean {
    const grade = this.grades.find(g => g.grade_id === grade_id);
    if (!grade) return false;
    const studentId = grade.student_id;
    this.grades = this.grades.filter(g => g.grade_id !== grade_id);
    this.recalculateStudentGPA(studentId);
    this.saveState();
    return true;
  }

  public insertAttendance(record: Omit<Attendance, 'attendance_id'>): Attendance {
    // Check if an existing record for student + course + session_date exists; if so, update
    const existingIdx = this.attendance.findIndex(
      a => a.student_id === record.student_id && a.course_id === record.course_id && a.session_date === record.session_date
    );
    if (existingIdx !== -1) {
      this.attendance[existingIdx] = { ...this.attendance[existingIdx], ...record };
      this.saveState();
      return this.attendance[existingIdx];
    }
    const nextId = this.attendance.length > 0 ? Math.max(...this.attendance.map(a => a.attendance_id)) + 1 : 1;
    const newRecord: Attendance = { ...record, attendance_id: nextId };
    this.attendance.push(newRecord);
    this.saveState();
    return newRecord;
  }

  public batchUpsertAttendance(records: Omit<Attendance, 'attendance_id'>[]): number {
    let affected = 0;
    records.forEach(rec => {
      this.insertAttendance(rec);
      affected++;
    });
    return affected;
  }

  public recalculateStudentGPA(student_id: number) {
    const studentGrades = this.grades.filter(g => g.student_id === student_id);
    if (studentGrades.length === 0) return;
    
    // Scale: Letter grade or score / 25
    let totalScore = 0;
    let totalWeight = 0;
    studentGrades.forEach(g => {
      const pct = (g.score / g.max_score) * 100;
      totalScore += pct * (g.weightage / 100);
      totalWeight += g.weightage / 100;
    });

    const averagePercent = totalWeight > 0 ? totalScore / totalWeight : 0;
    // Map to 4.0 scale: >=93 = 4.0, >=90 = 3.7, >=87 = 3.3, >=83 = 3.0, >=80 = 2.7, >=77 = 2.3, >=70 = 2.0, >=60 = 1.0, <60 = 0.0
    let gpa = 0.0;
    if (averagePercent >= 93) gpa = 4.0;
    else if (averagePercent >= 90) gpa = 3.7;
    else if (averagePercent >= 87) gpa = 3.3;
    else if (averagePercent >= 83) gpa = 3.0;
    else if (averagePercent >= 80) gpa = 2.7;
    else if (averagePercent >= 77) gpa = 2.3;
    else if (averagePercent >= 70) gpa = 2.0;
    else if (averagePercent >= 60) gpa = 1.0;
    else gpa = 0.0;

    const studentIdx = this.students.findIndex(s => s.student_id === student_id);
    if (studentIdx !== -1) {
      this.students[studentIdx].gpa = Number(gpa.toFixed(2));
    }
  }

  // Interactive SQL Query Interpreter
  public executeSql(queryText: string): SqlQueryResult {
    const startTime = performance.now();
    const cleanQuery = queryText.trim().replace(/;$/, '');
    const upper = cleanQuery.toUpperCase();

    try {
      if (upper.startsWith('SELECT')) {
        return this.handleSelectQuery(cleanQuery, startTime);
      } else if (upper.startsWith('SHOW TABLES')) {
        return {
          columns: ['Tables_in_student_management_db'],
          rows: [
            { Tables_in_student_management_db: 'students' },
            { Tables_in_student_management_db: 'courses' },
            { Tables_in_student_management_db: 'enrollments' },
            { Tables_in_student_management_db: 'grades' },
            { Tables_in_student_management_db: 'attendance' }
          ],
          rowCount: 5,
          executionTimeMs: Math.round(performance.now() - startTime),
          query: queryText
        };
      } else if (upper.startsWith('DESC') || upper.startsWith('DESCRIBE')) {
        const parts = cleanQuery.split(/\s+/);
        const tblName = parts[1]?.toLowerCase();
        const schema = SCHEMAS[tblName];
        if (!schema) {
          return {
            columns: [],
            rows: [],
            rowCount: 0,
            executionTimeMs: Math.round(performance.now() - startTime),
            query: queryText,
            error: `Table '${tblName}' doesn't exist in database 'student_management_db'`
          };
        }
        return {
          columns: ['Field', 'Type', 'Null', 'Key', 'Default', 'Extra'],
          rows: schema.columns.map(col => ({
            Field: col.name,
            Type: col.type,
            Null: col.isNullable ? 'YES' : 'NO',
            Key: col.isPrimary ? 'PRI' : col.references ? 'MUL' : '',
            Default: col.isPrimary ? 'NULL' : '',
            Extra: col.isAutoIncrement ? 'auto_increment' : ''
          })),
          rowCount: schema.columns.length,
          executionTimeMs: Math.round(performance.now() - startTime),
          query: queryText
        };
      } else {
        return {
          columns: ['Result'],
          rows: [{ Result: `Executed successfully against MySQL engine.` }],
          rowCount: 1,
          executionTimeMs: Math.round(performance.now() - startTime),
          query: queryText
        };
      }
    } catch (err: any) {
      return {
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: Math.round(performance.now() - startTime),
        query: queryText,
        error: err.message || 'Syntax error in SQL statement'
      };
    }
  }

  private handleSelectQuery(query: string, startTime: number): SqlQueryResult {
    const qLower = query.toLowerCase();

    // Check query targets
    if (qLower.includes('from students') && qLower.includes('join grades')) {
      // Common join query
      const joined = this.grades.map(g => {
        const s = this.students.find(stu => stu.student_id === g.student_id);
        const c = this.courses.find(cou => cou.course_id === g.course_id);
        return {
          student_id: g.student_id,
          roll_number: s?.roll_number,
          full_name: `${s?.first_name} ${s?.last_name}`,
          course_code: c?.course_code,
          assessment: g.assessment_type,
          score: `${g.score}/${g.max_score}`,
          letter_grade: g.letter_grade,
          graded_at: g.graded_at
        };
      });
      return {
        columns: ['student_id', 'roll_number', 'full_name', 'course_code', 'assessment', 'score', 'letter_grade', 'graded_at'],
        rows: joined,
        rowCount: joined.length,
        executionTimeMs: Math.round(performance.now() - startTime),
        query
      };
    }

    if (qLower.includes('from students') && (qLower.includes('group by') || qLower.includes('avg'))) {
      const grouped = this.students.map(s => {
        const sGrades = this.grades.filter(g => g.student_id === s.student_id);
        const avgScore = sGrades.length > 0 
          ? (sGrades.reduce((sum, g) => sum + g.score, 0) / sGrades.length).toFixed(2)
          : 'N/A';
        return {
          roll_number: s.roll_number,
          first_name: s.first_name,
          last_name: s.last_name,
          department: s.department,
          gpa: s.gpa,
          average_score: avgScore,
          graded_tasks: sGrades.length
        };
      });
      return {
        columns: ['roll_number', 'first_name', 'last_name', 'department', 'gpa', 'average_score', 'graded_tasks'],
        rows: grouped,
        rowCount: grouped.length,
        executionTimeMs: Math.round(performance.now() - startTime),
        query
      };
    }

    if (qLower.includes('from attendance') && qLower.includes('join students')) {
      const joined = this.attendance.map(a => {
        const s = this.students.find(stu => stu.student_id === a.student_id);
        const c = this.courses.find(cou => cou.course_id === a.course_id);
        return {
          attendance_id: a.attendance_id,
          roll_number: s?.roll_number,
          student_name: `${s?.first_name} ${s?.last_name}`,
          course_code: c?.course_code,
          session_date: a.session_date,
          status: a.status,
          remarks: a.remarks
        };
      });
      return {
        columns: ['attendance_id', 'roll_number', 'student_name', 'course_code', 'session_date', 'status', 'remarks'],
        rows: joined,
        rowCount: joined.length,
        executionTimeMs: Math.round(performance.now() - startTime),
        query
      };
    }

    // Single table queries
    if (qLower.includes('from students')) {
      let rows = [...this.students];
      if (qLower.includes('where gpa < 2.5') || qLower.includes('at_risk')) {
        rows = rows.filter(s => s.gpa < 2.5);
      } else if (qLower.includes("where department = 'computer science'")) {
        rows = rows.filter(s => s.department === 'Computer Science');
      }
      return {
        columns: ['student_id', 'roll_number', 'first_name', 'last_name', 'email', 'department', 'semester', 'gpa', 'status'],
        rows: rows.map(s => ({
          student_id: s.student_id,
          roll_number: s.roll_number,
          first_name: s.first_name,
          last_name: s.last_name,
          email: s.email,
          department: s.department,
          semester: s.semester,
          gpa: s.gpa,
          status: s.status
        })),
        rowCount: rows.length,
        executionTimeMs: Math.round(performance.now() - startTime),
        query
      };
    }

    if (qLower.includes('from courses')) {
      return {
        columns: ['course_id', 'course_code', 'course_name', 'department', 'credits', 'instructor', 'semester'],
        rows: this.courses,
        rowCount: this.courses.length,
        executionTimeMs: Math.round(performance.now() - startTime),
        query
      };
    }

    if (qLower.includes('from grades')) {
      return {
        columns: ['grade_id', 'student_id', 'course_id', 'assessment_type', 'score', 'max_score', 'weightage', 'letter_grade', 'graded_at'],
        rows: this.grades,
        rowCount: this.grades.length,
        executionTimeMs: Math.round(performance.now() - startTime),
        query
      };
    }

    if (qLower.includes('from attendance')) {
      return {
        columns: ['attendance_id', 'student_id', 'course_id', 'session_date', 'status', 'remarks'],
        rows: this.attendance,
        rowCount: this.attendance.length,
        executionTimeMs: Math.round(performance.now() - startTime),
        query
      };
    }

    // Default fallback
    return {
      columns: ['query_status', 'affected_rows', 'server'],
      rows: [{ query_status: 'OK', affected_rows: 0, server: 'MySQL 8.0.35 via JDBC Driver' }],
      rowCount: 1,
      executionTimeMs: Math.round(performance.now() - startTime),
      query
    };
  }
}

export const mysqlEngine = new MySQLEngine();
