import React from 'react';
import { 
  Users, 
  BookOpen, 
  Award, 
  CalendarCheck, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  Database,
  Cpu,
  Clock,
  Sparkles
} from 'lucide-react';
import { Student, Course, Grade, Attendance } from '../types';
import { AttendanceDAO } from '../jdbc/dao/AttendanceDAO';
import { NavTab } from './Navbar';

interface DashboardProps {
  students: Student[];
  courses: Course[];
  grades: Grade[];
  attendance: Attendance[];
  onNavigate: (tab: NavTab) => void;
  onSelectStudent: (student: Student) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  students,
  courses,
  grades,
  attendance,
  onNavigate,
  onSelectStudent
}) => {
  // Calculations
  const activeStudents = students.filter(s => s.status === 'ACTIVE').length;
  const avgGpa = students.length > 0 
    ? (students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2)
    : '0.00';
  const overallAttendanceRate = AttendanceDAO.getOverallAttendanceRate();

  // Find at-risk students: GPA < 2.0 OR attendance < 75%
  const atRiskStudents = students.filter(student => {
    const summary = AttendanceDAO.getStudentAttendanceSummary(student.student_id);
    return student.gpa < 2.0 || summary.is_at_risk;
  });

  // Grade distributions
  const gradeCounts: Record<string, number> = {
    'A+': 0, 'A': 0, 'A-': 0,
    'B+': 0, 'B': 0, 'B-': 0,
    'C+': 0, 'C': 0,
    'D': 0, 'F': 0
  };
  grades.forEach(g => {
    const letter = g.letter_grade.toUpperCase();
    if (gradeCounts[letter] !== undefined) {
      gradeCounts[letter]++;
    } else {
      gradeCounts[letter] = 1;
    }
  });

  const recentGrades = [...grades].slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Overview & System Health</h1>
          <p className="text-sm text-slate-500 mt-1">
            Student Management System powered by Java JDBC architecture and MySQL InnoDB storage.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('attendance')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Mark Today's Attendance</span>
          </button>
          <button
            onClick={() => onNavigate('grades')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Award className="w-4 h-4" />
            <span>Record Grades</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Students</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{students.length}</span>
            <span className="text-xs text-slate-500">({activeStudents} active)</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">Enrolled across 5 departments</div>
        </div>

        {/* Active Courses */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Courses</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{courses.length}</span>
            <span className="text-xs text-slate-500">curricula</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">Total 20 credit hours</div>
        </div>

        {/* Average GPA */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Campus Avg GPA</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{avgGpa}</span>
            <span className="text-xs text-slate-500">/ 4.00</span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Academic Standing: Good</span>
          </div>
        </div>

        {/* Campus Attendance Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Attendance Rate</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{overallAttendanceRate}%</span>
            <span className="text-xs text-slate-500">avg</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">Threshold target: ≥75%</div>
        </div>

        {/* At-Risk Interventions */}
        <div className="bg-white p-5 rounded-xl border border-rose-200 shadow-sm bg-rose-50/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rose-700 uppercase tracking-wider">At-Risk Students</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-rose-700">{atRiskStudents.length}</span>
            <span className="text-xs text-rose-600 font-medium">need attention</span>
          </div>
          <div className="mt-2 text-xs text-rose-600">GPA &lt; 2.0 or Att. &lt; 75%</div>
        </div>
      </div>

      {/* At-Risk Intervention Alert Banner */}
      {atRiskStudents.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h2 className="text-sm font-semibold text-rose-900">
                Academic Intervention Required ({atRiskStudents.length} Students)
              </h2>
            </div>
            <span className="text-xs text-rose-700">Immediate Faculty Attention Advised</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {atRiskStudents.map(student => {
              const summary = AttendanceDAO.getStudentAttendanceSummary(student.student_id);
              const gpaRisk = student.gpa < 2.0;
              const attRisk = summary.is_at_risk;

              return (
                <div
                  key={student.student_id}
                  onClick={() => onSelectStudent(student)}
                  className="bg-white p-3.5 rounded-lg border border-rose-200 hover:border-rose-400 cursor-pointer transition-colors shadow-xs flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm">{student.first_name} {student.last_name}</span>
                      <span className="text-xs text-slate-500 font-mono">({student.roll_number})</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                      <span>{student.department}</span>
                      <span>·</span>
                      {gpaRisk && <span className="text-rose-600 font-medium">Critical GPA: {student.gpa}</span>}
                      {gpaRisk && attRisk && <span>·</span>}
                      {attRisk && <span className="text-rose-600 font-medium">Low Attendance: {summary.attendance_percentage}%</span>}
                    </div>
                  </div>
                  <button className="text-xs text-blue-600 font-medium flex items-center gap-1 hover:underline">
                    <span>View Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Middle Section: Grade Distribution & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grade Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 text-sm">Campus Grade Distribution</h3>
              <span className="text-xs text-slate-500">{grades.length} Total Assessments</span>
            </div>

            <div className="space-y-2.5">
              {[
                { label: 'A / A+ (Excellent)', count: (gradeCounts['A+'] || 0) + (gradeCounts['A'] || 0), color: 'bg-emerald-500' },
                { label: 'B / B+ (Above Average)', count: (gradeCounts['B+'] || 0) + (gradeCounts['B'] || 0), color: 'bg-blue-500' },
                { label: 'C / C+ (Average)', count: (gradeCounts['C+'] || 0) + (gradeCounts['C'] || 0), color: 'bg-amber-500' },
                { label: 'D / F (Unsatisfactory)', count: (gradeCounts['D'] || 0) + (gradeCounts['F'] || 0), color: 'bg-rose-500' },
              ].map(item => {
                const pct = grades.length > 0 ? Math.round((item.count / grades.length) * 100) : 0;
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">{item.label}</span>
                      <span className="text-slate-900 font-semibold">{item.count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Grading scale: 4.0 Standard US/Bologna</span>
            <button
              onClick={() => onNavigate('grades')}
              className="text-blue-600 font-medium hover:underline flex items-center gap-1"
            >
              <span>View Gradebook</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Recent Grades Feed */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 text-sm">Recent Academic Assessments</h3>
              <span className="text-xs text-slate-500">Latest Recorded</span>
            </div>

            <div className="divide-y divide-slate-100">
              {recentGrades.map(grade => {
                const student = students.find(s => s.student_id === grade.student_id);
                const course = courses.find(c => c.course_id === grade.course_id);

                return (
                  <div key={grade.grade_id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-900">
                        {student?.first_name} {student?.last_name}
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        {course?.course_code} · {grade.assessment_type}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-slate-900">
                        {grade.score} / {grade.max_score}
                      </div>
                      <span className={`text-[10px] font-semibold ${
                        ['A+', 'A'].includes(grade.letter_grade) ? 'text-emerald-600' :
                        ['B+', 'B'].includes(grade.letter_grade) ? 'text-blue-600' :
                        ['C+', 'C'].includes(grade.letter_grade) ? 'text-amber-600' : 'text-rose-600'
                      }`}>
                        Grade {grade.letter_grade}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigate('grades')}
              className="w-full text-center text-xs text-blue-600 font-medium hover:underline"
            >
              Manage All Student Grades →
            </button>
          </div>
        </div>

        {/* JDBC Architecture & MySQL Engine Info */}
        <div className="bg-slate-900 text-slate-200 p-6 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-4 h-4 text-blue-400" />
              <h3 className="font-semibold text-white text-sm">JDBC & MySQL Architecture</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              All interactions in StudentSphere route through structured Data Access Objects (DAOs) executing parameterized SQL statements against the relational engine.
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-emerald-400 font-semibold">Driver:</span> com.mysql.cj.jdbc.Driver<br />
                <span className="text-emerald-400 font-semibold">Dialect:</span> MySQL 8.0 InnoDB<br />
                <span className="text-emerald-400 font-semibold">Connection:</span> HikariCP Pool
              </div>

              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px]">
                <div className="text-slate-400 uppercase text-[9px] mb-1 font-sans">Active Schema Tables</div>
                <div className="text-blue-300">students · courses · enrollments · grades · attendance</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <button
              onClick={() => onNavigate('sql')}
              className="text-blue-400 hover:text-blue-300 font-sans font-medium hover:underline flex items-center gap-1"
            >
              <span>Open SQL Console</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              onClick={() => onNavigate('jdbc')}
              className="text-emerald-400 hover:text-emerald-300 font-sans font-medium hover:underline flex items-center gap-1"
            >
              <span>View Java DAOs</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
