import React, { useState } from 'react';
import { 
  Award, 
  Plus, 
  Trash2, 
  Filter, 
  Layers, 
  CheckCircle2, 
  X, 
  Calculator, 
  HelpCircle 
} from 'lucide-react';
import { Student, Course, Grade, AssessmentType } from '../types';
import { GradeDAO } from '../jdbc/dao/GradeDAO';

interface GradesViewProps {
  students: Student[];
  courses: Course[];
  grades: Grade[];
  onRefresh: () => void;
}

export const GradesView: React.FC<GradesViewProps> = ({
  students,
  courses,
  grades,
  onRefresh
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('ALL');
  const [selectedAssessment, setSelectedAssessment] = useState<string>('ALL');
  const [searchStudent, setSearchStudent] = useState<string>('');

  // Modals
  const [isSingleModalOpen, setIsSingleModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  // Single Grade Form State
  const [singleForm, setSingleForm] = useState<{
    student_id: number;
    course_id: number;
    assessment_type: AssessmentType;
    score: number;
    max_score: number;
    weightage: number;
    remarks: string;
    graded_at: string;
  }>({
    student_id: students[0]?.student_id || 1,
    course_id: courses[0]?.course_id || 101,
    assessment_type: 'Assignment',
    score: 85,
    max_score: 100,
    weightage: 20,
    remarks: '',
    graded_at: new Date().toISOString().split('T')[0]
  });

  // Batch Grade Form State
  const [batchCourseId, setBatchCourseId] = useState<number>(courses[0]?.course_id || 101);
  const [batchAssessmentType, setBatchAssessmentType] = useState<AssessmentType>('Midterm');
  const [batchMaxScore, setBatchMaxScore] = useState<number>(100);
  const [batchWeightage, setBatchWeightage] = useState<number>(30);
  const [batchDate, setBatchDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [batchScores, setBatchScores] = useState<Record<number, { score: number; remarks: string }>>({});

  // Filtered grades list
  const filteredGrades = grades.filter(g => {
    const student = students.find(s => s.student_id === g.student_id);
    const matchesCourse = selectedCourseId === 'ALL' || g.course_id.toString() === selectedCourseId;
    const matchesAssessment = selectedAssessment === 'ALL' || g.assessment_type === selectedAssessment;
    const matchesSearch = !searchStudent || (
      student?.first_name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      student?.last_name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      student?.roll_number.toLowerCase().includes(searchStudent.toLowerCase())
    );
    return matchesCourse && matchesAssessment && matchesSearch;
  });

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    GradeDAO.recordGrade(singleForm);
    setIsSingleModalOpen(false);
    onRefresh();
  };

  const openBatchModal = () => {
    // Initialize batch scores for all students
    const initial: Record<number, { score: number; remarks: string }> = {};
    students.forEach(s => {
      initial[s.student_id] = { score: 85, remarks: '' };
    });
    setBatchScores(initial);
    setIsBatchModalOpen(true);
  };

  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const batchList = students.map(s => {
      const entry = batchScores[s.student_id] || { score: 80, remarks: '' };
      return {
        student_id: s.student_id,
        course_id: batchCourseId,
        assessment_type: batchAssessmentType,
        score: entry.score,
        max_score: batchMaxScore,
        weightage: batchWeightage,
        remarks: entry.remarks,
        graded_at: batchDate
      };
    });

    GradeDAO.batchRecordGrades(batchList);
    setIsBatchModalOpen(false);
    onRefresh();
  };

  const handleDeleteGrade = (gradeId: number) => {
    if (window.confirm('Delete this grade record? Student GPA will be automatically recalculated.')) {
      GradeDAO.deleteGrade(gradeId);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Entry Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Academic Gradebook & GPA Tracking</h1>
          <p className="text-xs text-slate-500 mt-1">
            Record assessment marks, automate letter grading, and recalculate cumulative GPAs via <code className="font-mono text-blue-600 bg-blue-50 px-1 py-0.5 rounded">GradeDAO.java</code>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSingleModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Record Grade</span>
          </button>

          <button
            onClick={openBatchModal}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Batch Grade Class</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between text-xs">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by student name or roll number..."
            value={searchStudent}
            onChange={e => setSearchStudent(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedCourseId}
            onChange={e => setSelectedCourseId(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Courses ({courses.length})</option>
            {courses.map(c => (
              <option key={c.course_id} value={c.course_id.toString()}>
                {c.course_code} - {c.course_name}
              </option>
            ))}
          </select>

          <select
            value={selectedAssessment}
            onChange={e => setSelectedAssessment(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Assessment Types</option>
            <option value="Quiz">Quiz</option>
            <option value="Midterm">Midterm</option>
            <option value="Assignment">Assignment</option>
            <option value="Project">Project</option>
            <option value="Final Exam">Final Exam</option>
          </select>
        </div>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold">
              <tr>
                <th className="px-5 py-3 text-left">Student</th>
                <th className="px-5 py-3 text-left">Course</th>
                <th className="px-5 py-3 text-left">Assessment</th>
                <th className="px-5 py-3 text-center">Score / Max</th>
                <th className="px-5 py-3 text-center">Percent</th>
                <th className="px-5 py-3 text-center">Letter Grade</th>
                <th className="px-5 py-3 text-center">Weight</th>
                <th className="px-5 py-3 text-left">Graded Date</th>
                <th className="px-5 py-3 text-left">Remarks</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGrades.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center text-slate-400">
                    No grade assessments found matching the chosen criteria.
                  </td>
                </tr>
              ) : (
                filteredGrades.map(grade => {
                  const student = students.find(s => s.student_id === grade.student_id);
                  const course = courses.find(c => c.course_id === grade.course_id);
                  const pct = Math.round((grade.score / grade.max_score) * 100);

                  return (
                    <tr key={grade.grade_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3 font-medium text-slate-900">
                        <div>{student?.first_name} {student?.last_name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{student?.roll_number}</div>
                      </td>

                      <td className="px-5 py-3 text-slate-700">
                        <div className="font-semibold text-slate-800">{course?.course_code}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{course?.course_name}</div>
                      </td>

                      <td className="px-5 py-3 text-slate-700">
                        <span className="font-medium">{grade.assessment_type}</span>
                      </td>

                      <td className="px-5 py-3 text-center font-bold text-slate-800">
                        {grade.score} / {grade.max_score}
                      </td>

                      <td className="px-5 py-3 text-center font-medium text-slate-600">
                        {pct}%
                      </td>

                      <td className="px-5 py-3 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${
                          ['A+', 'A'].includes(grade.letter_grade) ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          ['B+', 'B'].includes(grade.letter_grade) ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          ['C+', 'C'].includes(grade.letter_grade) ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {grade.letter_grade}
                        </span>
                      </td>

                      <td className="px-5 py-3 text-center text-slate-500 font-mono">
                        {grade.weightage}%
                      </td>

                      <td className="px-5 py-3 text-slate-500 font-mono text-[11px]">
                        {grade.graded_at}
                      </td>

                      <td className="px-5 py-3 text-slate-500 italic max-w-xs truncate">
                        {grade.remarks || '—'}
                      </td>

                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => handleDeleteGrade(grade.grade_id)}
                          title="Delete Assessment"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade Scale Reference Card */}
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-2 mb-2 font-semibold text-slate-800">
          <Calculator className="w-4 h-4 text-blue-600" />
          <span>Grading Scale & Automated 4.0 GPA Mapping</span>
        </div>
        <p className="text-slate-500 leading-relaxed mb-3">
          Scores are evaluated in <code className="font-mono text-slate-700">GradeDAO.java</code>. The cumulative GPA updates upon every <code className="font-mono text-slate-700">INSERT</code> or <code className="font-mono text-slate-700">DELETE</code> via weighted calculation.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 text-center">
          {[
            { grade: 'A+', range: '≥ 95%', gpa: '4.00' },
            { grade: 'A', range: '90 - 94%', gpa: '3.70' },
            { grade: 'B+', range: '85 - 89%', gpa: '3.30' },
            { grade: 'B', range: '80 - 84%', gpa: '3.00' },
            { grade: 'C+', range: '75 - 79%', gpa: '2.30' },
            { grade: 'C', range: '70 - 74%', gpa: '2.00' },
            { grade: 'D', range: '60 - 69%', gpa: '1.00' },
            { grade: 'F', range: '< 60%', gpa: '0.00' },
          ].map(scale => (
            <div key={scale.grade} className="bg-white p-2 rounded border border-slate-200">
              <div className="font-bold text-slate-900">{scale.grade}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{scale.range}</div>
              <div className="text-[10px] font-mono text-blue-600 font-semibold">{scale.gpa} pts</div>
            </div>
          ))}
        </div>
      </div>

      {/* Single Grade Entry Modal */}
      {isSingleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-400" />
                <h3 className="font-semibold text-sm">Record Student Grade via JDBC</h3>
              </div>
              <button
                onClick={() => setIsSingleModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSingleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Select Student</label>
                <select
                  value={singleForm.student_id}
                  onChange={e => setSingleForm({ ...singleForm, student_id: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  {students.map(s => (
                    <option key={s.student_id} value={s.student_id}>
                      {s.first_name} {s.last_name} ({s.roll_number}) - {s.department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Select Course</label>
                <select
                  value={singleForm.course_id}
                  onChange={e => setSingleForm({ ...singleForm, course_id: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  {courses.map(c => (
                    <option key={c.course_id} value={c.course_id}>
                      {c.course_code} - {c.course_name} ({c.instructor})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Assessment Type</label>
                  <select
                    value={singleForm.assessment_type}
                    onChange={e => setSingleForm({ ...singleForm, assessment_type: e.target.value as AssessmentType })}
                    className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none"
                  >
                    <option value="Quiz">Quiz</option>
                    <option value="Midterm">Midterm</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Project">Project</option>
                    <option value="Final Exam">Final Exam</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Graded Date</label>
                  <input
                    type="date"
                    required
                    value={singleForm.graded_at}
                    onChange={e => setSingleForm({ ...singleForm, graded_at: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Score Obtained</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max={singleForm.max_score}
                    required
                    value={singleForm.score}
                    onChange={e => setSingleForm({ ...singleForm, score: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Max Score</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={singleForm.max_score}
                    onChange={e => setSingleForm({ ...singleForm, max_score: parseFloat(e.target.value) || 100 })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Weightage (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={singleForm.weightage}
                    onChange={e => setSingleForm({ ...singleForm, weightage: parseFloat(e.target.value) || 20 })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              {/* Real-time letter preview */}
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600">Calculated Letter Grade:</span>
                <span className="font-bold text-blue-600 text-sm">
                  {GradeDAO.computeLetterGrade(singleForm.score, singleForm.max_score)}
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Instructor Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Excellent work on SQL normalization"
                  value={singleForm.remarks}
                  onChange={e => setSingleForm({ ...singleForm, remarks: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSingleModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
                >
                  Insert Grade (INSERT INTO grades)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fast Batch Grade Entry Modal */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold text-sm">Fast Batch Class Grade Entry (JDBC executeBatch)</h3>
              </div>
              <button
                onClick={() => setIsBatchModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBatchSubmit} className="flex-1 flex flex-col overflow-hidden text-xs">
              {/* Batch Configuration Strip */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">Target Course</label>
                  <select
                    value={batchCourseId}
                    onChange={e => setBatchCourseId(parseInt(e.target.value))}
                    className="w-full px-2.5 py-1.5 border rounded-lg bg-white"
                  >
                    {courses.map(c => (
                      <option key={c.course_id} value={c.course_id}>
                        {c.course_code} - {c.course_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Assessment</label>
                  <select
                    value={batchAssessmentType}
                    onChange={e => setBatchAssessmentType(e.target.value as AssessmentType)}
                    className="w-full px-2.5 py-1.5 border rounded-lg bg-white"
                  >
                    <option value="Quiz">Quiz</option>
                    <option value="Midterm">Midterm</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Project">Project</option>
                    <option value="Final Exam">Final Exam</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Max Score</label>
                  <input
                    type="number"
                    value={batchMaxScore}
                    onChange={e => setBatchMaxScore(parseFloat(e.target.value) || 100)}
                    className="w-full px-2.5 py-1.5 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Weight (%)</label>
                  <input
                    type="number"
                    value={batchWeightage}
                    onChange={e => setBatchWeightage(parseFloat(e.target.value) || 20)}
                    className="w-full px-2.5 py-1.5 border rounded-lg"
                  />
                </div>
              </div>

              {/* Roster Input List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <div className="text-[11px] text-slate-500 font-medium mb-1">
                  Enter scores for each student. Prepared statement batch updates will run inside an atomic transaction:
                </div>

                {students.map(s => {
                  const current = batchScores[s.student_id] || { score: 85, remarks: '' };
                  const letter = GradeDAO.computeLetterGrade(current.score, batchMaxScore);

                  return (
                    <div
                      key={s.student_id}
                      className="flex items-center gap-3 p-2.5 bg-white border border-slate-200 rounded-lg hover:border-slate-300"
                    >
                      <div className="w-1/3 min-w-0">
                        <div className="font-semibold text-slate-900 truncate">{s.first_name} {s.last_name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{s.roll_number}</div>
                      </div>

                      <div className="w-24">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max={batchMaxScore}
                          value={current.score}
                          onChange={e => {
                            const val = parseFloat(e.target.value) || 0;
                            setBatchScores({
                              ...batchScores,
                              [s.student_id]: { ...current, score: val }
                            });
                          }}
                          className="w-full px-2.5 py-1 border rounded text-center font-bold text-slate-900"
                        />
                      </div>

                      <div className="w-14 text-center font-bold text-blue-600">
                        {letter}
                      </div>

                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Optional remark..."
                          value={current.remarks}
                          onChange={e => {
                            setBatchScores({
                              ...batchScores,
                              [s.student_id]: { ...current, remarks: e.target.value }
                            });
                          }}
                          className="w-full px-2.5 py-1 border rounded text-xs"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <div className="text-slate-500 text-[11px]">
                  Batching {students.length} grade entries via <code className="font-mono">pstmt.executeBatch()</code>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBatchModalOpen(false)}
                    className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Commit Batch Grades</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
