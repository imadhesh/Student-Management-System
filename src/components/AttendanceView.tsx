import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, 
  Check, 
  X, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Save, 
  Calendar, 
  Filter, 
  UserCheck, 
  ArrowUpDown 
} from 'lucide-react';
import { Student, Course, Attendance, AttendanceStatus } from '../types';
import { AttendanceDAO } from '../jdbc/dao/AttendanceDAO';

interface AttendanceViewProps {
  students: Student[];
  courses: Course[];
  attendance: Attendance[];
  onRefresh: () => void;
  onSelectStudent: (student: Student) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  students,
  courses,
  attendance,
  onRefresh,
  onSelectStudent
}) => {
  const [activeTab, setActiveTab] = useState<'register' | 'standings'>('register');

  // Register state
  const [selectedCourseId, setSelectedCourseId] = useState<number>(courses[0]?.course_id || 101);
  const [sessionDate, setSessionDate] = useState<string>('2026-10-06');
  const [registerStatus, setRegisterStatus] = useState<Record<number, { status: AttendanceStatus; remarks: string }>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Standings filter state
  const [standingsDept, setStandingsDept] = useState<string>('ALL');
  const [onlyAtRisk, setOnlyAtRisk] = useState<boolean>(false);

  // Initialize or load existing attendance for the selected Course + Date
  useEffect(() => {
    const existingForDay = attendance.filter(
      a => a.course_id === selectedCourseId && a.session_date === sessionDate
    );

    const initialMap: Record<number, { status: AttendanceStatus; remarks: string }> = {};
    students.forEach(s => {
      const match = existingForDay.find(a => a.student_id === s.student_id);
      if (match) {
        initialMap[s.student_id] = { status: match.status, remarks: match.remarks || '' };
      } else {
        initialMap[s.student_id] = { status: 'PRESENT', remarks: '' };
      }
    });

    setRegisterStatus(initialMap);
  }, [selectedCourseId, sessionDate, attendance, students]);

  const setAllStatus = (newStatus: AttendanceStatus) => {
    const updated: Record<number, { status: AttendanceStatus; remarks: string }> = {};
    students.forEach(s => {
      updated[s.student_id] = {
        status: newStatus,
        remarks: registerStatus[s.student_id]?.remarks || ''
      };
    });
    setRegisterStatus(updated);
  };

  const handleSaveRegister = () => {
    const records = students.map(s => {
      const entry = registerStatus[s.student_id] || { status: 'PRESENT', remarks: '' };
      return {
        student_id: s.student_id,
        course_id: selectedCourseId,
        session_date: sessionDate,
        status: entry.status,
        remarks: entry.remarks
      };
    });

    AttendanceDAO.batchRecordAttendance(records);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
    onRefresh();
  };

  // Register session statistics
  const statusValues = Object.values(registerStatus);
  const presentCount = statusValues.filter(e => e.status === 'PRESENT').length;
  const lateCount = statusValues.filter(e => e.status === 'LATE').length;
  const excusedCount = statusValues.filter(e => e.status === 'EXCUSED').length;
  const absentCount = statusValues.filter(e => e.status === 'ABSENT').length;
  const sessionTotal = statusValues.length;
  const sessionRate = sessionTotal > 0
    ? Math.round(((presentCount + lateCount * 0.5 + excusedCount) / sessionTotal) * 100)
    : 100;

  // Standings data
  const standingsData = students
    .map(s => {
      const summary = AttendanceDAO.getStudentAttendanceSummary(s.student_id);
      return {
        student: s,
        summary
      };
    })
    .filter(item => {
      const matchDept = standingsDept === 'ALL' || item.student.department === standingsDept;
      const matchAtRisk = !onlyAtRisk || item.summary.is_at_risk;
      return matchDept && matchAtRisk;
    });

  return (
    <div className="space-y-6">
      {/* Top Banner and Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Attendance Tracking & Verification</h1>
          <p className="text-xs text-slate-500 mt-1">
            Conduct roll calls, mark sessions, and enforce the 75% attendance compliance rule via <code className="font-mono text-blue-600 bg-blue-50 px-1 py-0.5 rounded">AttendanceDAO.java</code>.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('register')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'register'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Session Roll Call Register
          </button>
          <button
            onClick={() => setActiveTab('standings')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'standings'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student Standings & Thresholds (&lt;75%)
          </button>
        </div>
      </div>

      {activeTab === 'register' ? (
        <div className="space-y-4">
          {/* Session Configuration Strip */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between text-xs">
            <div className="flex items-center gap-3 flex-wrap flex-1">
              {/* Course Selector */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Select Course</label>
                <select
                  value={selectedCourseId}
                  onChange={e => setSelectedCourseId(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg bg-white text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {courses.map(c => (
                    <option key={c.course_id} value={c.course_id}>
                      {c.course_code} - {c.course_name} ({c.instructor})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selector */}
              <div className="w-44">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Session Date</label>
                <input
                  type="date"
                  value={sessionDate}
                  onChange={e => setSessionDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white text-slate-800 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Quick Actions & Save Button */}
            <div className="flex items-end gap-2">
              <button
                onClick={() => setAllStatus('PRESENT')}
                className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-medium transition-colors"
                title="Mark all students as Present"
              >
                Mark All Present
              </button>

              <button
                onClick={handleSaveRegister}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition-colors flex items-center gap-1.5"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Saved to MySQL!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Register (JDBC)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Session Real-time Summary Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600">Present:</span>
              <span className="font-bold text-slate-900">{presentCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-slate-600">Late:</span>
              <span className="font-bold text-slate-900">{lateCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span className="text-slate-600">Excused:</span>
              <span className="font-bold text-slate-900">{excusedCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-slate-600">Absent:</span>
              <span className="font-bold text-slate-900">{absentCount}</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <span className="text-slate-600">Session Rate:</span>
              <span className={sessionRate >= 75 ? 'text-emerald-700' : 'text-rose-600'}>
                {sessionRate}%
              </span>
            </div>
          </div>

          {/* Roll Call Student Register Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold">
                <tr>
                  <th className="px-5 py-3 text-left">Roll Number</th>
                  <th className="px-5 py-3 text-left">Student Name</th>
                  <th className="px-5 py-3 text-left">Department</th>
                  <th className="px-5 py-3 text-center">Current Status</th>
                  <th className="px-5 py-3 text-left">Remarks / Excuse</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map(student => {
                  const current = registerStatus[student.student_id] || { status: 'PRESENT', remarks: '' };

                  return (
                    <tr key={student.student_id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3 font-mono font-bold text-slate-800">
                        {student.roll_number}
                      </td>

                      <td className="px-5 py-3">
                        <div className="font-semibold text-slate-900">{student.first_name} {student.last_name}</div>
                        <div className="text-[11px] text-slate-400">{student.email}</div>
                      </td>

                      <td className="px-5 py-3 text-slate-600">
                        {student.department}
                      </td>

                      {/* Status toggle buttons */}
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-center gap-1">
                          {(['PRESENT', 'LATE', 'EXCUSED', 'ABSENT'] as AttendanceStatus[]).map(st => {
                            const isSelected = current.status === st;
                            return (
                              <button
                                key={st}
                                type="button"
                                onClick={() => {
                                  setRegisterStatus({
                                    ...registerStatus,
                                    [student.student_id]: { ...current, status: st }
                                  });
                                }}
                                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                                  isSelected
                                    ? st === 'PRESENT'
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : st === 'LATE'
                                      ? 'bg-amber-600 text-white shadow-xs'
                                      : st === 'EXCUSED'
                                      ? 'bg-blue-600 text-white shadow-xs'
                                      : 'bg-rose-600 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {st}
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      <td className="px-5 py-3">
                        <input
                          type="text"
                          placeholder="e.g. Doctor note or tardy reason..."
                          value={current.remarks}
                          onChange={e => {
                            setRegisterStatus({
                              ...registerStatus,
                              [student.student_id]: { ...current, remarks: e.target.value }
                            });
                          }}
                          className="w-full px-2.5 py-1 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Standings View */
        <div className="space-y-4">
          {/* Filters for Standings */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-3">
              <select
                value={standingsDept}
                onChange={e => setStandingsDept(e.target.value)}
                className="px-3 py-2 border rounded-lg bg-white"
              >
                <option value="ALL">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Data Science">Data Science</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
              </select>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-rose-700 bg-rose-50 px-3 py-2 rounded-lg border border-rose-200">
                <input
                  type="checkbox"
                  checked={onlyAtRisk}
                  onChange={e => setOnlyAtRisk(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>Only Show At-Risk Students (&lt; 75%)</span>
              </label>
            </div>

            <div className="text-slate-500">
              Showing {standingsData.length} students
            </div>
          </div>

          {/* Standings Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold">
                <tr>
                  <th className="px-5 py-3 text-left">Roll Number</th>
                  <th className="px-5 py-3 text-left">Student</th>
                  <th className="px-5 py-3 text-left">Department</th>
                  <th className="px-5 py-3 text-center">Total Classes</th>
                  <th className="px-5 py-3 text-center text-emerald-700">Present</th>
                  <th className="px-5 py-3 text-center text-amber-700">Late</th>
                  <th className="px-5 py-3 text-center text-blue-700">Excused</th>
                  <th className="px-5 py-3 text-center text-rose-700">Absent</th>
                  <th className="px-5 py-3 text-center">Overall Attendance %</th>
                  <th className="px-5 py-3 text-center">Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {standingsData.map(({ student, summary }) => {
                  return (
                    <tr
                      key={student.student_id}
                      onClick={() => onSelectStudent(student)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-3 font-mono font-bold text-slate-800">
                        {student.roll_number}
                      </td>

                      <td className="px-5 py-3">
                        <div className="font-semibold text-slate-900">{student.first_name} {student.last_name}</div>
                        <div className="text-[11px] text-slate-400">{student.email}</div>
                      </td>

                      <td className="px-5 py-3 text-slate-600">
                        {student.department}
                      </td>

                      <td className="px-5 py-3 text-center font-medium text-slate-800">
                        {summary.total_sessions}
                      </td>

                      <td className="px-5 py-3 text-center font-bold text-emerald-600">
                        {summary.present_count}
                      </td>

                      <td className="px-5 py-3 text-center font-bold text-amber-600">
                        {summary.late_count}
                      </td>

                      <td className="px-5 py-3 text-center font-bold text-blue-600">
                        {summary.excused_count}
                      </td>

                      <td className="px-5 py-3 text-center font-bold text-rose-600">
                        {summary.absent_count}
                      </td>

                      <td className="px-5 py-3 text-center">
                        <div className="font-bold text-sm">
                          <span className={summary.attendance_percentage < 75 ? 'text-rose-600' : 'text-emerald-700'}>
                            {summary.attendance_percentage}%
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-3 text-center">
                        {summary.is_at_risk ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Action Needed</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Check className="w-3 h-3" />
                            <span>Compliant</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
