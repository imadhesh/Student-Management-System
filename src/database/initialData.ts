import { Student, Course, Enrollment, Grade, Attendance } from '../types';

export const INITIAL_COURSES: Course[] = [
  {
    course_id: 101,
    course_code: 'CS201',
    course_name: 'Database Management Systems & SQL',
    department: 'Computer Science',
    credits: 4,
    instructor: 'Dr. Robert Martinez',
    semester: 3
  },
  {
    course_id: 102,
    course_code: 'CS302',
    course_name: 'Object-Oriented Programming with Java',
    department: 'Computer Science',
    credits: 4,
    instructor: 'Prof. Katherine Vance',
    semester: 3
  },
  {
    course_id: 103,
    course_code: 'DS210',
    course_name: 'Data Structures & Algorithms',
    department: 'Data Science',
    credits: 3,
    instructor: 'Dr. Ananya Sharma',
    semester: 4
  },
  {
    course_id: 104,
    course_code: 'EE205',
    course_name: 'Digital Logic & Microprocessors',
    department: 'Electrical Engineering',
    credits: 4,
    instructor: 'Prof. Marcus Chen',
    semester: 4
  },
  {
    course_id: 105,
    course_code: 'IT310',
    course_name: 'Enterprise Web Applications & JDBC',
    department: 'Information Technology',
    credits: 3,
    instructor: 'Dr. Elena Rostova',
    semester: 5
  },
  {
    course_id: 106,
    course_code: 'ME150',
    course_name: 'Engineering Mechanics & Dynamics',
    department: 'Mechanical Engineering',
    credits: 3,
    instructor: 'Prof. Thomas Wright',
    semester: 2
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    student_id: 1,
    roll_number: 'CS-2024-001',
    first_name: 'Alexander',
    last_name: 'Hayes',
    email: 'alexander.hayes@university.edu',
    phone: '+1 (555) 234-5678',
    department: 'Computer Science',
    semester: 3,
    enrollment_date: '2024-08-15',
    status: 'ACTIVE',
    gpa: 3.85
  },
  {
    student_id: 2,
    roll_number: 'CS-2024-002',
    first_name: 'Sophia',
    last_name: 'Nguyen',
    email: 'sophia.nguyen@university.edu',
    phone: '+1 (555) 345-6789',
    department: 'Computer Science',
    semester: 3,
    enrollment_date: '2024-08-15',
    status: 'ACTIVE',
    gpa: 3.92
  },
  {
    student_id: 3,
    roll_number: 'IT-2024-015',
    first_name: 'Liam',
    last_name: 'O\'Connor',
    email: 'liam.oconnor@university.edu',
    phone: '+1 (555) 456-7890',
    department: 'Information Technology',
    semester: 5,
    enrollment_date: '2023-08-20',
    status: 'ACTIVE',
    gpa: 3.25
  },
  {
    student_id: 4,
    roll_number: 'DS-2024-008',
    first_name: 'Maya',
    last_name: 'Patel',
    email: 'maya.patel@university.edu',
    phone: '+1 (555) 567-8901',
    department: 'Data Science',
    semester: 4,
    enrollment_date: '2024-01-10',
    status: 'ACTIVE',
    gpa: 3.70
  },
  {
    student_id: 5,
    roll_number: 'EE-2024-021',
    first_name: 'Lucas',
    last_name: 'Morales',
    email: 'lucas.morales@university.edu',
    phone: '+1 (555) 678-9012',
    department: 'Electrical Engineering',
    semester: 4,
    enrollment_date: '2024-01-10',
    status: 'ACTIVE',
    gpa: 1.95 // At-risk GPA
  },
  {
    student_id: 6,
    roll_number: 'CS-2024-045',
    first_name: 'Emma',
    last_name: 'Zhang',
    email: 'emma.zhang@university.edu',
    phone: '+1 (555) 789-0123',
    department: 'Computer Science',
    semester: 3,
    enrollment_date: '2024-08-15',
    status: 'ACTIVE',
    gpa: 3.48
  },
  {
    student_id: 7,
    roll_number: 'ME-2024-004',
    first_name: 'Noah',
    last_name: 'Kowalski',
    email: 'noah.kowalski@university.edu',
    phone: '+1 (555) 890-1234',
    department: 'Mechanical Engineering',
    semester: 2,
    enrollment_date: '2025-01-15',
    status: 'ACTIVE',
    gpa: 2.80
  },
  {
    student_id: 8,
    roll_number: 'CS-2024-067',
    first_name: 'Ethan',
    last_name: 'Brooks',
    email: 'ethan.brooks@university.edu',
    phone: '+1 (555) 901-2345',
    department: 'Computer Science',
    semester: 3,
    enrollment_date: '2024-08-15',
    status: 'ACTIVE',
    gpa: 2.10 // Low attendance & borderline
  },
  {
    student_id: 9,
    roll_number: 'IT-2024-032',
    first_name: 'Ava',
    last_name: 'Castillo',
    email: 'ava.castillo@university.edu',
    phone: '+1 (555) 112-3344',
    department: 'Information Technology',
    semester: 5,
    enrollment_date: '2023-08-20',
    status: 'ACTIVE',
    gpa: 3.65
  },
  {
    student_id: 10,
    roll_number: 'DS-2024-019',
    first_name: 'Zane',
    last_name: 'Al-Mansoor',
    email: 'zane.mansoor@university.edu',
    phone: '+1 (555) 223-4455',
    department: 'Data Science',
    semester: 4,
    enrollment_date: '2024-01-10',
    status: 'ACTIVE',
    gpa: 3.55
  }
];

export const INITIAL_ENROLLMENTS: Enrollment[] = [
  // CS201 (DBMS)
  { enrollment_id: 1, student_id: 1, course_id: 101, enrollment_date: '2024-08-20', academic_term: 'Fall 2026' },
  { enrollment_id: 2, student_id: 2, course_id: 101, enrollment_date: '2024-08-20', academic_term: 'Fall 2026' },
  { enrollment_id: 3, student_id: 6, course_id: 101, enrollment_date: '2024-08-20', academic_term: 'Fall 2026' },
  { enrollment_id: 4, student_id: 8, course_id: 101, enrollment_date: '2024-08-20', academic_term: 'Fall 2026' },
  // CS302 (Java OOP)
  { enrollment_id: 5, student_id: 1, course_id: 102, enrollment_date: '2024-08-20', academic_term: 'Fall 2026' },
  { enrollment_id: 6, student_id: 2, course_id: 102, enrollment_date: '2024-08-20', academic_term: 'Fall 2026' },
  { enrollment_id: 7, student_id: 6, course_id: 102, enrollment_date: '2024-08-20', academic_term: 'Fall 2026' },
  { enrollment_id: 8, student_id: 8, course_id: 102, enrollment_date: '2024-08-20', academic_term: 'Fall 2026' },
  // DS210 (DSA)
  { enrollment_id: 9, student_id: 4, course_id: 103, enrollment_date: '2024-08-22', academic_term: 'Fall 2026' },
  { enrollment_id: 10, student_id: 10, course_id: 103, enrollment_date: '2024-08-22', academic_term: 'Fall 2026' },
  { enrollment_id: 11, student_id: 2, course_id: 103, enrollment_date: '2024-08-22', academic_term: 'Fall 2026' },
  // EE205
  { enrollment_id: 12, student_id: 5, course_id: 104, enrollment_date: '2024-08-21', academic_term: 'Fall 2026' },
  // IT310
  { enrollment_id: 13, student_id: 3, course_id: 105, enrollment_date: '2024-08-19', academic_term: 'Fall 2026' },
  { enrollment_id: 14, student_id: 9, course_id: 105, enrollment_date: '2024-08-19', academic_term: 'Fall 2026' },
  // ME150
  { enrollment_id: 15, student_id: 7, course_id: 106, enrollment_date: '2024-08-25', academic_term: 'Fall 2026' }
];

export const INITIAL_GRADES: Grade[] = [
  // Student 1 (Alexander) - CS201
  { grade_id: 1, student_id: 1, course_id: 101, assessment_type: 'Midterm', score: 94, max_score: 100, weightage: 30, letter_grade: 'A', remarks: 'Superb query optimization understanding', graded_at: '2026-09-18' },
  { grade_id: 2, student_id: 1, course_id: 101, assessment_type: 'Assignment', score: 98, max_score: 100, weightage: 20, letter_grade: 'A+', remarks: 'Impeccable schema normalization design', graded_at: '2026-09-28' },
  { grade_id: 3, student_id: 1, course_id: 101, assessment_type: 'Quiz', score: 90, max_score: 100, weightage: 10, letter_grade: 'A-', remarks: 'Great relational algebra answers', graded_at: '2026-10-02' },
  // Student 1 (Alexander) - CS302
  { grade_id: 4, student_id: 1, course_id: 102, assessment_type: 'Midterm', score: 92, max_score: 100, weightage: 30, letter_grade: 'A', remarks: 'Strong OOP polymorphism patterns', graded_at: '2026-09-20' },
  { grade_id: 5, student_id: 1, course_id: 102, assessment_type: 'Project', score: 96, max_score: 100, weightage: 25, letter_grade: 'A', remarks: 'Clean JDBC DAO implementation', graded_at: '2026-10-01' },

  // Student 2 (Sophia) - CS201
  { grade_id: 6, student_id: 2, course_id: 101, assessment_type: 'Midterm', score: 99, max_score: 100, weightage: 30, letter_grade: 'A+', remarks: 'Perfect score on B-Tree indexing question', graded_at: '2026-09-18' },
  { grade_id: 7, student_id: 2, course_id: 101, assessment_type: 'Assignment', score: 100, max_score: 100, weightage: 20, letter_grade: 'A+', remarks: 'Exceptional relational calculus', graded_at: '2026-09-28' },
  // Student 2 (Sophia) - CS302
  { grade_id: 8, student_id: 2, course_id: 102, assessment_type: 'Midterm', score: 95, max_score: 100, weightage: 30, letter_grade: 'A', remarks: 'Exceptional multithreading mastery', graded_at: '2026-09-20' },

  // Student 3 (Liam) - IT310
  { grade_id: 9, student_id: 3, course_id: 105, assessment_type: 'Midterm', score: 82, max_score: 100, weightage: 30, letter_grade: 'B', remarks: 'Good grasp of Servlets and connection pooling', graded_at: '2026-09-22' },
  { grade_id: 10, student_id: 3, course_id: 105, assessment_type: 'Assignment', score: 85, max_score: 100, weightage: 20, letter_grade: 'B', remarks: 'Complete JDBC batch update exercise', graded_at: '2026-09-30' },

  // Student 4 (Maya) - DS210
  { grade_id: 11, student_id: 4, course_id: 103, assessment_type: 'Midterm', score: 91, max_score: 100, weightage: 30, letter_grade: 'A-', remarks: 'Strong dynamic programming recursion tree', graded_at: '2026-09-25' },
  { grade_id: 12, student_id: 4, course_id: 103, assessment_type: 'Quiz', score: 88, max_score: 100, weightage: 15, letter_grade: 'B+', remarks: 'AVL tree rotation solved correctly', graded_at: '2026-10-03' },

  // Student 5 (Lucas) - EE205 (At risk)
  { grade_id: 13, student_id: 5, course_id: 104, assessment_type: 'Midterm', score: 58, max_score: 100, weightage: 30, letter_grade: 'D', remarks: 'Struggled with Karnaugh map minimization', graded_at: '2026-09-19' },
  { grade_id: 14, student_id: 5, course_id: 104, assessment_type: 'Quiz', score: 62, max_score: 100, weightage: 15, letter_grade: 'D', remarks: 'Need to review flip-flop timing diagrams', graded_at: '2026-10-02' },

  // Student 6 (Emma) - CS201 & CS302
  { grade_id: 15, student_id: 6, course_id: 101, assessment_type: 'Midterm', score: 88, max_score: 100, weightage: 30, letter_grade: 'B+', remarks: 'Well-formed SQL joins and views', graded_at: '2026-09-18' },
  { grade_id: 16, student_id: 6, course_id: 102, assessment_type: 'Midterm', score: 86, max_score: 100, weightage: 30, letter_grade: 'B', remarks: 'Solid Java generics comprehension', graded_at: '2026-09-20' },

  // Student 8 (Ethan) - CS201 & CS302 (Borderline)
  { grade_id: 17, student_id: 8, course_id: 101, assessment_type: 'Midterm', score: 64, max_score: 100, weightage: 30, letter_grade: 'D', remarks: 'Incomplete subqueries and indexing errors', graded_at: '2026-09-18' },
  { grade_id: 18, student_id: 8, course_id: 102, assessment_type: 'Midterm', score: 68, max_score: 100, weightage: 30, letter_grade: 'D+', remarks: 'Exception handling was neglected', graded_at: '2026-09-20' }
];

export const INITIAL_ATTENDANCE: Attendance[] = [
  // CS201 Sessions
  // 2026-09-15
  { attendance_id: 1, student_id: 1, course_id: 101, session_date: '2026-09-15', status: 'PRESENT', remarks: 'On time' },
  { attendance_id: 2, student_id: 2, course_id: 101, session_date: '2026-09-15', status: 'PRESENT', remarks: 'On time' },
  { attendance_id: 3, student_id: 6, course_id: 101, session_date: '2026-09-15', status: 'PRESENT', remarks: 'On time' },
  { attendance_id: 4, student_id: 8, course_id: 101, session_date: '2026-09-15', status: 'ABSENT', remarks: 'Unexcused' },

  // 2026-09-22
  { attendance_id: 5, student_id: 1, course_id: 101, session_date: '2026-09-22', status: 'PRESENT', remarks: 'On time' },
  { attendance_id: 6, student_id: 2, course_id: 101, session_date: '2026-09-22', status: 'PRESENT', remarks: 'On time' },
  { attendance_id: 7, student_id: 6, course_id: 101, session_date: '2026-09-22', status: 'LATE', remarks: 'Arrived 10 min late' },
  { attendance_id: 8, student_id: 8, course_id: 101, session_date: '2026-09-22', status: 'ABSENT', remarks: 'Unexcused' },

  // 2026-09-29
  { attendance_id: 9, student_id: 1, course_id: 101, session_date: '2026-09-29', status: 'PRESENT', remarks: 'Active participant' },
  { attendance_id: 10, student_id: 2, course_id: 101, session_date: '2026-09-29', status: 'PRESENT', remarks: 'On time' },
  { attendance_id: 11, student_id: 6, course_id: 101, session_date: '2026-09-29', status: 'PRESENT', remarks: 'On time' },
  { attendance_id: 12, student_id: 8, course_id: 101, session_date: '2026-09-29', status: 'LATE', remarks: '15m late' },

  // 2026-10-06 (Today)
  { attendance_id: 13, student_id: 1, course_id: 101, session_date: '2026-10-06', status: 'PRESENT', remarks: 'On time' },
  { attendance_id: 14, student_id: 2, course_id: 101, session_date: '2026-10-06', status: 'PRESENT', remarks: 'On time' },
  { attendance_id: 15, student_id: 6, course_id: 101, session_date: '2026-10-06', status: 'PRESENT', remarks: 'On time' },
  { attendance_id: 16, student_id: 8, course_id: 101, session_date: '2026-10-06', status: 'ABSENT', remarks: 'Unexcused absence' },

  // CS302 Sessions
  // 2026-09-17
  { attendance_id: 17, student_id: 1, course_id: 102, session_date: '2026-09-17', status: 'PRESENT', remarks: 'On time' },
  { attendance_id: 18, student_id: 2, course_id: 102, session_date: '2026-09-17', status: 'PRESENT', remarks: 'On time' },
  { attendance_id: 19, student_id: 6, course_id: 102, session_date: '2026-09-17', status: 'PRESENT', remarks: 'On time' },
  { attendance_id: 20, student_id: 8, course_id: 102, session_date: '2026-09-17', status: 'ABSENT', remarks: 'No notice' },

  // 2026-09-24
  { attendance_id: 21, student_id: 1, course_id: 102, session_date: '2026-09-24', status: 'PRESENT', remarks: 'On time' },
  { attendance_id: 22, student_id: 2, course_id: 102, session_date: '2026-09-24', status: 'PRESENT', remarks: 'On time' },
  { attendance_id: 23, student_id: 6, course_id: 102, session_date: '2026-09-24', status: 'PRESENT', remarks: 'On time' },
  { attendance_id: 24, student_id: 8, course_id: 102, session_date: '2026-09-24', status: 'EXCUSED', remarks: 'Doctor note' },

  // 2026-10-01
  { attendance_id: 25, student_id: 1, course_id: 102, session_date: '2026-10-01', status: 'PRESENT', remarks: 'Lab demo finished' },
  { attendance_id: 26, student_id: 2, course_id: 102, session_date: '2026-10-01', status: 'PRESENT', remarks: 'Lab demo finished' },
  { attendance_id: 27, student_id: 6, course_id: 102, session_date: '2026-10-01', status: 'PRESENT', remarks: 'On time' },
  { attendance_id: 28, student_id: 8, course_id: 102, session_date: '2026-10-01', status: 'ABSENT', remarks: 'Missed lab' },

  // EE205 Sessions for Lucas (Student 5)
  { attendance_id: 29, student_id: 5, course_id: 104, session_date: '2026-09-16', status: 'ABSENT', remarks: 'Sick' },
  { attendance_id: 30, student_id: 5, course_id: 104, session_date: '2026-09-23', status: 'ABSENT', remarks: 'Unexcused' },
  { attendance_id: 31, student_id: 5, course_id: 104, session_date: '2026-09-30', status: 'LATE', remarks: '20m late' },
  { attendance_id: 32, student_id: 5, course_id: 104, session_date: '2026-10-05', status: 'PRESENT', remarks: 'On time' },

  // DS210 Sessions for Maya (4) & Zane (10)
  { attendance_id: 33, student_id: 4, course_id: 103, session_date: '2026-09-18', status: 'PRESENT', remarks: 'On time' },
  { attendance_id: 34, student_id: 10, course_id: 103, session_date: '2026-09-18', status: 'PRESENT', remarks: 'On time' },
  { attendance_id: 35, student_id: 4, course_id: 103, session_date: '2026-09-25', status: 'PRESENT', remarks: 'On time' },
  { attendance_id: 36, student_id: 10, course_id: 103, session_date: '2026-09-25', status: 'PRESENT', remarks: 'On time' },
  { attendance_id: 37, student_id: 4, course_id: 103, session_date: '2026-10-02', status: 'PRESENT', remarks: 'On time' },
  { attendance_id: 38, student_id: 10, course_id: 103, session_date: '2026-10-02', status: 'PRESENT', remarks: 'On time' },

  // IT310 Sessions for Liam (3) & Ava (9)
  { attendance_id: 39, student_id: 3, course_id: 105, session_date: '2026-09-20', status: 'PRESENT', remarks: 'On time' },
  { attendance_id: 40, student_id: 9, course_id: 105, session_date: '2026-09-20', status: 'PRESENT', remarks: 'On time' },
  { attendance_id: 41, student_id: 3, course_id: 105, session_date: '2026-09-27', status: 'PRESENT', remarks: 'On time' },
  { attendance_id: 42, student_id: 9, course_id: 105, session_date: '2026-09-27', status: 'PRESENT', remarks: 'On time' },
  { attendance_id: 43, student_id: 3, course_id: 105, session_date: '2026-10-04', status: 'PRESENT', remarks: 'On time' },
  { attendance_id: 44, student_id: 9, course_id: 105, session_date: '2026-10-04', status: 'PRESENT', remarks: 'On time' }
];
