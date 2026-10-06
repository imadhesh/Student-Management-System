export type Department = 
  | 'Computer Science' 
  | 'Information Technology' 
  | 'Data Science' 
  | 'Electrical Engineering' 
  | 'Mechanical Engineering';

export type StudentStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface Student {
  student_id: number;
  roll_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: Department;
  semester: number;
  enrollment_date: string;
  status: StudentStatus;
  gpa: number;
}

export interface Course {
  course_id: number;
  course_code: string;
  course_name: string;
  department: Department;
  credits: number;
  instructor: string;
  semester: number;
}

export interface Enrollment {
  enrollment_id: number;
  student_id: number;
  course_id: number;
  enrollment_date: string;
  academic_term: string;
}

export type AssessmentType = 'Quiz' | 'Midterm' | 'Assignment' | 'Project' | 'Final Exam';

export interface Grade {
  grade_id: number;
  student_id: number;
  course_id: number;
  assessment_type: AssessmentType;
  score: number;
  max_score: number;
  weightage: number; // percentage (e.g. 20%)
  letter_grade: string;
  remarks: string;
  graded_at: string;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface Attendance {
  attendance_id: number;
  student_id: number;
  course_id: number;
  session_date: string;
  status: AttendanceStatus;
  remarks: string;
}

export interface JdbcLogEntry {
  id: string;
  timestamp: string;
  daoMethod: string;
  sql: string;
  params: (string | number | boolean | null)[];
  executionTimeMs: number;
  rowsAffected?: number;
  status: 'SUCCESS' | 'ERROR';
  errorMessage?: string;
  javaCode: string;
}

export interface SqlQueryResult {
  columns: string[];
  rows: Record<string, any>[];
  rowCount: number;
  executionTimeMs: number;
  query: string;
  error?: string;
}
