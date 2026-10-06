import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Award, 
  CalendarCheck, 
  Printer, 
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Student, Course, Grade, Attendance } from '../types';
import { AttendanceDAO } from '../jdbc/dao/AttendanceDAO';

interface StudentProfileModalProps {
  student: Student | null;
  courses: Course[];
  grades: Grade[];
  attendance: Attendance[];
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  courses,
  grades,
  attendance,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'grades' | 'attendance' | 'print'>('grades');

  if (!student) return null;

  const studentGrades = grades.filter(g => g.student_id === student.student_id);
  const studentAttendance = attendance.filter(a => a.student_id === student.student_id);
  const attendanceSummary = AttendanceDAO.getStudentAttendanceSummary(student.student_id);

  // Group grades by course
  const courseGradesMap = new Map<number, Grade[]>();
  studentGrades.forEach(g => {
    const list = courseGradesMap.get(g.course_id) || [];
    list.push(g);
    courseGradesMap.set(g.course_id, list);
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400 font-bold text-lg">
              {student.first_name[0]}{student.last_name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{student.first_name} {student.last_name}</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-900 text-blue-300 font-mono">
                  {student.roll_number}
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                  student.status === 'ACTIVE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                }`}>
                  {student.status}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>{student.department}</span>
                <span>·</span>
                <span>Semester {student.semester}</span>
                <span>·</span>
                <span>Enrolled {student.enrollment_date}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Print Official Transcript"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print Transcript</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Highlights / Stats Strip */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-slate-500 uppercase font-medium text-[10px]">Cumulative GPA</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5 flex items-center gap-1">
              <span>{student.gpa.toFixed(2)}</span>
              <span className="text-xs text-slate-500">/ 4.0</span>
            </div>
          </div>

          <div>
            <div className="text-slate-500 uppercase font-medium text-[10px]">Attendance Rate</div>
            <div className="text-lg font-bold mt-0.5 flex items-center gap-1.5">
              <span className={attendanceSummary.attendance_percentage < 75 ? 'text-rose-600' : 'text-emerald-600'}>
                {attendanceSummary.attendance_percentage}%
              </span>
              {attendanceSummary.attendance_percentage < 75 ? (
                <span className="text-[10px] text-rose-600 font-semibold">(Below 75%)</span>
              ) : (
                <span className="text-[10px] text-emerald-600 font-semibold">(Good Standing)</span>
              )}
            </div>
          </div>

          <div>
            <div className="text-slate-500 uppercase font-medium text-[10px]">Total Assessments</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              {studentGrades.length} graded
            </div>
          </div>

          <div>
            <div className="text-slate-500 uppercase font-medium text-[10px]">Attendance Records</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              {attendanceSummary.total_sessions} sessions ({attendanceSummary.present_count} present)
            </div>
          </div>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('grades')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'grades'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Academic Transcript & Grades ({studentGrades.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'attendance'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Attendance History ({studentAttendance.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('print')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'print'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Official Report Card Preview</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'grades' && (
            <div className="space-y-6">
              {studentGrades.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No grade entries have been recorded for this student yet.
                </div>
              ) : (
                Array.from(courseGradesMap.entries()).map(([courseId, courseGradeList]) => {
                  const course = courses.find(c => c.course_id === courseId);
                  return (
                    <div key={courseId} className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-slate-900 text-xs">
                            {course?.course_code} - {course?.course_name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Instructor: {course?.instructor} · {course?.credits} Credits
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-700">
                          {courseGradeList.length} assessments
                        </span>
                      </div>

                      <table className="min-w-full divide-y divide-slate-200 text-xs">
                        <thead className="bg-white text-slate-500">
                          <tr>
                            <th className="px-4 py-2.5 text-left font-medium">Assessment</th>
                            <th className="px-4 py-2.5 text-left font-medium">Score</th>
                            <th className="px-4 py-2.5 text-left font-medium">Percentage</th>
                            <th className="px-4 py-2.5 text-left font-medium">Grade</th>
                            <th className="px-4 py-2.5 text-left font-medium">Weight</th>
                            <th className="px-4 py-2.5 text-left font-medium">Graded Date</th>
                            <th className="px-4 py-2.5 text-left font-medium">Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {courseGradeList.map(g => {
                            const pct = Math.round((g.score / g.max_score) * 100);
                            return (
                              <tr key={g.grade_id} className="hover:bg-slate-50/50">
                                <td className="px-4 py-2.5 font-medium text-slate-900">{g.assessment_type}</td>
                                <td className="px-4 py-2.5 text-slate-700">{g.score} / {g.max_score}</td>
                                <td className="px-4 py-2.5 text-slate-700">{pct}%</td>
                                <td className="px-4 py-2.5">
                                  <span className={`font-bold ${
                                    ['A+', 'A'].includes(g.letter_grade) ? 'text-emerald-600' :
                                    ['B+', 'B'].includes(g.letter_grade) ? 'text-blue-600' :
                                    ['C+', 'C'].includes(g.letter_grade) ? 'text-amber-600' : 'text-rose-600'
                                  }`}>
                                    {g.letter_grade}
                                  </span>
                                </td>
                                <td className="px-4 py-2.5 text-slate-500">{g.weightage}%</td>
                                <td className="px-4 py-2.5 text-slate-500 font-mono text-[11px]">{g.graded_at}</td>
                                <td className="px-4 py-2.5 text-slate-500 italic">{g.remarks || '—'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg text-center text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase">Present</span>
                  <div className="text-base font-bold text-emerald-600">{attendanceSummary.present_count}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase">Late</span>
                  <div className="text-base font-bold text-amber-600">{attendanceSummary.late_count}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase">Excused</span>
                  <div className="text-base font-bold text-blue-600">{attendanceSummary.excused_count}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase">Absent</span>
                  <div className="text-base font-bold text-rose-600">{attendanceSummary.absent_count}</div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-medium">Session Date</th>
                      <th className="px-4 py-2.5 text-left font-medium">Course</th>
                      <th className="px-4 py-2.5 text-left font-medium">Status</th>
                      <th className="px-4 py-2.5 text-left font-medium">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {studentAttendance.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                          No attendance records logged for this student yet.
                        </td>
                      </tr>
                    ) : (
                      studentAttendance.map(att => {
                        const course = courses.find(c => c.course_id === att.course_id);
                        return (
                          <tr key={att.attendance_id} className="hover:bg-slate-50">
                            <td className="px-4 py-2.5 font-mono text-slate-800">{att.session_date}</td>
                            <td className="px-4 py-2.5 text-slate-700">
                              {course?.course_code} - {course?.course_name}
                            </td>
                            <td className="px-4 py-2.5">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                                att.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                att.status === 'LATE' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                att.status === 'EXCUSED' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}>
                                {att.status}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-slate-500 italic">{att.remarks || '—'}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'print' && (
            <div className="bg-white border-2 border-slate-300 rounded-xl p-8 max-w-2xl mx-auto shadow-md text-slate-800">
              {/* Institutional Header */}
              <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
                <h1 className="text-xl font-bold tracking-tight uppercase text-slate-900">Department of Higher Education</h1>
                <h2 className="text-sm font-semibold text-slate-600">Official Student Grade & Attendance Transcript</h2>
                <div className="text-[11px] text-slate-400 mt-1 font-mono">Verified by StudentSphere JDBC & MySQL Storage</div>
              </div>

              {/* Student Metadata Dossier */}
              <div className="grid grid-cols-2 gap-y-2 gap-x-6 text-xs mb-6 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-slate-500 font-medium">Student Name: </span>
                  <span className="font-bold text-slate-900">{student.first_name} {student.last_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Roll Number: </span>
                  <span className="font-mono font-bold text-slate-900">{student.roll_number}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Department: </span>
                  <span className="text-slate-900">{student.department}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Current Semester: </span>
                  <span className="text-slate-900">Semester {student.semester}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Enrollment Date: </span>
                  <span className="text-slate-900">{student.enrollment_date}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Academic Status: </span>
                  <span className="font-bold text-emerald-700">{student.status}</span>
                </div>
              </div>

              {/* Academic Summary Scores */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex justify-around text-center mb-6">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Cumulative GPA</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{student.gpa.toFixed(2)}</div>
                  <div className="text-[10px] text-slate-400">Scale: 4.00</div>
                </div>
                <div className="border-r border-slate-200"></div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Attendance Standing</div>
                  <div className={`text-2xl font-bold mt-1 ${attendanceSummary.attendance_percentage < 75 ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {attendanceSummary.attendance_percentage}%
                  </div>
                  <div className="text-[10px] text-slate-400">{attendanceSummary.total_sessions} Recorded Sessions</div>
                </div>
              </div>

              {/* Assessment Breakdown */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Subject Performance Summary</h3>
                <table className="min-w-full text-xs border border-slate-200">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-2 text-left border-b">Course</th>
                      <th className="p-2 text-left border-b">Assessment</th>
                      <th className="p-2 text-center border-b">Score</th>
                      <th className="p-2 text-center border-b">Letter Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentGrades.map(g => {
                      const course = courses.find(c => c.course_id === g.course_id);
                      return (
                        <tr key={g.grade_id} className="border-b">
                          <td className="p-2">{course?.course_code}</td>
                          <td className="p-2">{g.assessment_type}</td>
                          <td className="p-2 text-center">{g.score}/{g.max_score}</td>
                          <td className="p-2 text-center font-bold">{g.letter_grade}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Signature lines */}
              <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs text-slate-500 mt-8">
                <div>
                  <div className="border-b border-slate-400 w-3/4 mx-auto mb-1"></div>
                  <span>Academic Dean / Registrar</span>
                </div>
                <div>
                  <div className="border-b border-slate-400 w-3/4 mx-auto mb-1"></div>
                  <span>Faculty Advisor</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
