import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { StudentsView } from './components/StudentsView';
import { GradesView } from './components/GradesView';
import { AttendanceView } from './components/AttendanceView';
import { CoursesView } from './components/CoursesView';
import { SqlConsole } from './components/SqlConsole';
import { JdbcWorkbench } from './components/JdbcWorkbench';
import { JdbcLiveLog } from './components/JdbcLiveLog';
import { StudentProfileModal } from './components/StudentProfileModal';

import { mysqlEngine } from './database/mysqlEngine';
import { Student, Course, Grade, Attendance } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isLogOpen, setIsLogOpen] = useState(false);

  // Entities state
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  // Selected student for 360 profile / transcript modal
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const refreshData = () => {
    setStudents(mysqlEngine.getStudents());
    setCourses(mysqlEngine.getCourses());
    setGrades(mysqlEngine.getGrades());
    setAttendance(mysqlEngine.getAttendance());

    // Update selected student if modal is open
    if (selectedStudent) {
      const updated = mysqlEngine.getStudents().find(s => s.student_id === selectedStudent.student_id);
      if (updated) setSelectedStudent(updated);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        isLogOpen={isLogOpen}
        onToggleLog={() => setIsLogOpen(prev => !prev)}
        onResetDatabase={refreshData}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {currentTab === 'dashboard' && (
          <Dashboard
            students={students}
            courses={courses}
            grades={grades}
            attendance={attendance}
            onNavigate={setCurrentTab}
            onSelectStudent={setSelectedStudent}
          />
        )}

        {currentTab === 'students' && (
          <StudentsView
            students={students}
            onRefresh={refreshData}
            onSelectStudent={setSelectedStudent}
          />
        )}

        {currentTab === 'grades' && (
          <GradesView
            students={students}
            courses={courses}
            grades={grades}
            onRefresh={refreshData}
          />
        )}

        {currentTab === 'attendance' && (
          <AttendanceView
            students={students}
            courses={courses}
            attendance={attendance}
            onRefresh={refreshData}
            onSelectStudent={setSelectedStudent}
          />
        )}

        {currentTab === 'courses' && (
          <CoursesView
            courses={courses}
            students={students}
            onRefresh={refreshData}
          />
        )}

        {currentTab === 'sql' && (
          <SqlConsole />
        )}

        {currentTab === 'jdbc' && (
          <JdbcWorkbench />
        )}
      </main>

      {/* Student 360° Profile & Transcript Modal */}
      {selectedStudent && (
        <StudentProfileModal
          student={selectedStudent}
          courses={courses}
          grades={grades}
          attendance={attendance}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {/* Real-time JDBC Query Stream / Wire Console */}
      <JdbcLiveLog
        isOpen={isLogOpen}
        onClose={() => setIsLogOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">StudentSphere Management System</span>
            <span>·</span>
            <span>Java JDBC 4.2 Specification</span>
            <span>·</span>
            <span>MySQL 8.0 InnoDB Dialect</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLogOpen(prev => !prev)}
              className="text-blue-600 hover:underline font-medium"
            >
              {isLogOpen ? 'Hide JDBC Wire' : 'Inspect JDBC Wire'}
            </button>
            <span>·</span>
            <button
              onClick={() => setCurrentTab('jdbc')}
              className="text-blue-600 hover:underline font-medium"
            >
              View Java Source
            </button>
            <span>·</span>
            <button
              onClick={() => setCurrentTab('sql')}
              className="text-blue-600 hover:underline font-medium"
            >
              SQL Query Console
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
