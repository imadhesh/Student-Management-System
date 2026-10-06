import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Filter, 
  AlertCircle,
  GraduationCap,
  X
} from 'lucide-react';
import { Student, Department, StudentStatus } from '../types';
import { StudentDAO } from '../jdbc/dao/StudentDAO';
import { AttendanceDAO } from '../jdbc/dao/AttendanceDAO';

interface StudentsViewProps {
  students: Student[];
  onRefresh: () => void;
  onSelectStudent: (student: Student) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  onRefresh,
  onSelectStudent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedSemester, setSelectedSemester] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Add form state
  const [formData, setFormData] = useState<{
    roll_number: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    department: Department;
    semester: number;
    enrollment_date: string;
    status: StudentStatus;
  }>({
    roll_number: `CS-2024-${String(Math.floor(Math.random() * 800) + 100)}`,
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: 'Computer Science',
    semester: 1,
    enrollment_date: new Date().toISOString().split('T')[0],
    status: 'ACTIVE'
  });

  const departments: Department[] = [
    'Computer Science',
    'Information Technology',
    'Data Science',
    'Electrical Engineering',
    'Mechanical Engineering'
  ];

  // Filtering
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.roll_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === 'ALL' || student.department === selectedDept;
    const matchesSem = selectedSemester === 'ALL' || student.semester.toString() === selectedSemester;
    const matchesStatus = selectedStatus === 'ALL' || student.status === selectedStatus;

    return matchesSearch && matchesDept && matchesSem && matchesStatus;
  });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name || !formData.email) return;

    StudentDAO.addStudent({
      ...formData,
      gpa: 3.50 // Initial starting GPA
    });

    setIsAddModalOpen(false);
    // Reset form
    setFormData({
      roll_number: `CS-2024-${String(Math.floor(Math.random() * 800) + 100)}`,
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      department: 'Computer Science',
      semester: 1,
      enrollment_date: new Date().toISOString().split('T')[0],
      status: 'ACTIVE'
    });
    onRefresh();
  };

  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    StudentDAO.updateStudent(editingStudent.student_id, {
      first_name: editingStudent.first_name,
      last_name: editingStudent.last_name,
      email: editingStudent.email,
      phone: editingStudent.phone,
      department: editingStudent.department,
      semester: editingStudent.semester,
      status: editingStudent.status
    });

    setEditingStudent(null);
    onRefresh();
  };

  const handleDelete = (student: Student) => {
    if (window.confirm(`Are you sure you want to delete ${student.first_name} ${student.last_name} (${student.roll_number})?\n\nForeign Key constraint ON DELETE CASCADE will remove all associated grades and attendance records.`)) {
      StudentDAO.deleteStudent(student.student_id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Student Directory & Profiles</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse, manage, and inspect individual student records mapped via <code className="font-mono text-blue-600 bg-blue-50 px-1 py-0.5 rounded">StudentDAO.java</code>.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, roll number, or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-slate-50/50"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={selectedSemester}
            onChange={e => setSelectedSemester(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
              <option key={s} value={s.toString()}>Semester {s}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Students Data Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold">
              <tr>
                <th className="px-5 py-3 text-left">Roll Number</th>
                <th className="px-5 py-3 text-left">Student Name</th>
                <th className="px-5 py-3 text-left">Department</th>
                <th className="px-5 py-3 text-center">Semester</th>
                <th className="px-5 py-3 text-center">GPA</th>
                <th className="px-5 py-3 text-center">Attendance</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                    No students found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => {
                  const summary = AttendanceDAO.getStudentAttendanceSummary(student.student_id);
                  const isAtRisk = student.gpa < 2.0 || summary.is_at_risk;

                  return (
                    <tr
                      key={student.student_id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => onSelectStudent(student)}
                    >
                      <td className="px-5 py-3 font-mono font-bold text-slate-800">
                        {student.roll_number}
                      </td>

                      <td className="px-5 py-3">
                        <div className="font-semibold text-slate-900">{student.first_name} {student.last_name}</div>
                        <div className="text-slate-400 text-[11px]">{student.email}</div>
                      </td>

                      <td className="px-5 py-3 text-slate-700">
                        {student.department}
                      </td>

                      <td className="px-5 py-3 text-center text-slate-700 font-medium">
                        Sem {student.semester}
                      </td>

                      <td className="px-5 py-3 text-center">
                        <span className={`font-bold ${
                          student.gpa >= 3.5 ? 'text-emerald-600' :
                          student.gpa >= 2.5 ? 'text-blue-600' :
                          student.gpa >= 2.0 ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                          {student.gpa.toFixed(2)}
                        </span>
                      </td>

                      <td className="px-5 py-3 text-center">
                        <span className={`font-semibold ${
                          summary.attendance_percentage >= 75 ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {summary.attendance_percentage}%
                        </span>
                        {summary.is_at_risk && (
                          <div className="text-[10px] text-rose-500 font-bold">At Risk</div>
                        )}
                      </td>

                      <td className="px-5 py-3 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${
                          student.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {student.status}
                        </span>
                      </td>

                      <td className="px-5 py-3 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onSelectStudent(student)}
                            title="View Academic Dossier"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingStudent(student)}
                            title="Edit Student Record"
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(student)}
                            title="Delete Student"
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-400" />
                <h3 className="font-semibold text-sm">Add New Student to MySQL Database</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Roll Number</label>
                  <input
                    type="text"
                    required
                    value={formData.roll_number}
                    onChange={e => setFormData({ ...formData, roll_number: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value as Department })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    {departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. John"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">University Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="john.doe@university.edu"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Semester (1 - 8)</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    required
                    value={formData.semester}
                    onChange={e => setFormData({ ...formData, semester: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Enrollment Date</label>
                  <input
                    type="date"
                    required
                    value={formData.enrollment_date}
                    onChange={e => setFormData({ ...formData, enrollment_date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as StudentStatus })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
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
                  Execute INSERT (StudentDAO)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <h3 className="font-semibold text-sm">Update Student #{editingStudent.student_id}</h3>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateStudent} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.first_name}
                    onChange={e => setEditingStudent({ ...editingStudent, first_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.last_name}
                    onChange={e => setEditingStudent({ ...editingStudent, last_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={editingStudent.email}
                  onChange={e => setEditingStudent({ ...editingStudent, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editingStudent.phone}
                    onChange={e => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Semester</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={editingStudent.semester}
                    onChange={e => setEditingStudent({ ...editingStudent, semester: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Department</label>
                  <select
                    value={editingStudent.department}
                    onChange={e => setEditingStudent({ ...editingStudent, department: e.target.value as Department })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    {departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Status</label>
                  <select
                    value={editingStudent.status}
                    onChange={e => setEditingStudent({ ...editingStudent, status: e.target.value as StudentStatus })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Save (UPDATE students)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
