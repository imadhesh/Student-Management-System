import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  GraduationCap, 
  User, 
  Clock, 
  Layers, 
  X 
} from 'lucide-react';
import { Course, Student, Department } from '../types';
import { CourseDAO } from '../jdbc/dao/CourseDAO';

interface CoursesViewProps {
  courses: Course[];
  students: Student[];
  onRefresh: () => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  students,
  onRefresh
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  const [formData, setFormData] = useState<{
    course_code: string;
    course_name: string;
    department: Department;
    credits: number;
    instructor: string;
    semester: number;
  }>({
    course_code: 'CS401',
    course_name: '',
    department: 'Computer Science',
    credits: 3,
    instructor: '',
    semester: 4
  });

  const departments: Department[] = [
    'Computer Science',
    'Information Technology',
    'Data Science',
    'Electrical Engineering',
    'Mechanical Engineering'
  ];

  const filteredCourses = courses.filter(c => {
    return selectedDept === 'ALL' || c.department === selectedDept;
  });

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.course_code || !formData.course_name || !formData.instructor) return;

    CourseDAO.addCourse(formData);
    setIsAddModalOpen(false);
    setFormData({
      course_code: 'CS401',
      course_name: '',
      department: 'Computer Science',
      credits: 3,
      instructor: '',
      semester: 4
    });
    onRefresh();
  };

  const handleDeleteCourse = (courseId: number, code: string) => {
    if (window.confirm(`Delete course ${code}?\n\nAll associated student enrollments, grades, and attendance logs for this course will be cascaded.`)) {
      CourseDAO.deleteCourse(courseId);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Courses & Curriculum Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Academic courses, credit hours, and instructors stored in MySQL table <code className="font-mono text-blue-600 bg-blue-50 px-1 py-0.5 rounded">courses</code> managed via <code className="font-mono text-blue-600 bg-blue-50 px-1 py-0.5 rounded">CourseDAO.java</code>.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Filter by Department:</span>
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 border rounded-lg bg-white"
          >
            <option value="ALL">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div className="text-slate-500">
          Showing {filteredCourses.length} courses
        </div>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map(course => {
          // Count enrolled students in this department or semester
          const deptStudents = students.filter(s => s.department === course.department);

          return (
            <div
              key={course.course_id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded">
                    {course.course_code}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Semester {course.semester}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug">
                  {course.course_name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{course.department}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Instructor: <strong className="text-slate-800">{course.instructor}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Weight: <strong className="text-slate-800">{course.credits} Credits</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  ~{deptStudents.length} eligible students
                </span>
                <button
                  onClick={() => handleDeleteCourse(course.course_id, course.course_code)}
                  title="Delete Course"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Course Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <h3 className="font-semibold text-sm">Add New Course (CourseDAO)</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCourse} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS402"
                    value={formData.course_code}
                    onChange={e => setFormData({ ...formData, course_code: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Credits (1-6)</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    required
                    value={formData.credits}
                    onChange={e => setFormData({ ...formData, credits: parseInt(e.target.value) || 3 })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Operating Systems"
                  value={formData.course_name}
                  onChange={e => setFormData({ ...formData, course_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Department</label>
                <select
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value as Department })}
                  className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none"
                >
                  {departments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Lead Instructor</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Alan Turing"
                    value={formData.instructor}
                    onChange={e => setFormData({ ...formData, instructor: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Semester</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    required
                    value={formData.semester}
                    onChange={e => setFormData({ ...formData, semester: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
                >
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
