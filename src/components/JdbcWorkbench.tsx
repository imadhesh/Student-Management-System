import React, { useState } from 'react';
import { 
  Code2, 
  Download, 
  Copy, 
  Check, 
  Play, 
  FileCode, 
  Terminal, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  BookOpen 
} from 'lucide-react';
import { JAVA_PROJECT_FILES, JavaFileItem } from '../jdbc/javaCodeSnippets';
import { exportJavaMavenZip, downloadSchemaSql } from '../utils/exportProject';
import { StudentDAO } from '../jdbc/dao/StudentDAO';
import { GradeDAO } from '../jdbc/dao/GradeDAO';

export const JdbcWorkbench: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<JavaFileItem>(JAVA_PROJECT_FILES[2]); // DBConnection.java default
  const [copied, setCopied] = useState(false);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isRunningTest, setIsRunningTest] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunJdbcTest = () => {
    setIsRunningTest(true);
    setTestOutput(null);

    setTimeout(() => {
      try {
        const students = StudentDAO.getAllStudents();
        const topStudents = students.slice(0, 3);
        const output = `[INFO] Initializing JDBC Connection to MySQL 8.0...
[OK] Driver loaded: com.mysql.cj.jdbc.Driver
[OK] Connected to jdbc:mysql://localhost:3306/student_management_db
[INFO] Executing StudentDAO.getAllStudents()...
[OK] Query: SELECT * FROM students ORDER BY roll_number ASC
[OK] ResultSet returned ${students.length} rows. Mapped to List<Student>.

First 3 mapped Student POJOs:
${topStudents.map(s => `  -> [ID: ${s.student_id}] ${s.roll_number} | ${s.first_name} ${s.last_name} | GPA: ${s.gpa.toFixed(2)} | Dept: ${s.department}`).join('\n')}

[SUCCESS] JDBC Test completed successfully in 3ms.`;
        setTestOutput(output);
      } catch (err: any) {
        setTestOutput(`[ERROR] java.sql.SQLException: ${err.message}`);
      } finally {
        setIsRunningTest(false);
      }
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Project Download Actions */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Java JDBC Architecture & Code Workbench</h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete production-grade Java classes using standard <code className="font-mono text-blue-600 bg-blue-50 px-1 py-0.5 rounded">java.sql.*</code> interfaces, PreparedStatements, and connection pooling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportJavaMavenZip()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Download Maven Project (.zip)</span>
          </button>
          <button
            onClick={() => downloadSchemaSql()}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <FileCode className="w-4 h-4" />
            <span>Download schema.sql</span>
          </button>
        </div>
      </div>

      {/* Main Code View and Test Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* File Navigator Tabs (1 col) */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-xs">
            <div className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Project Artifacts</span>
            </div>

            <div className="space-y-1">
              {JAVA_PROJECT_FILES.map(file => {
                const isSelected = selectedFile.filename === file.filename;
                return (
                  <button
                    key={file.filename}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-colors flex items-start gap-2 ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-200 text-blue-900 font-semibold'
                        : 'bg-white border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <FileCode className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                    <div className="min-w-0">
                      <div className="truncate font-mono text-xs">{file.filename}</div>
                      <div className="text-[10px] text-slate-400 font-sans truncate">{file.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Test Runner Widget */}
          <div className="bg-slate-900 text-white p-4 rounded-xl shadow-sm text-xs space-y-3">
            <div className="flex items-center gap-2 font-semibold text-slate-200">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>JDBC Test Harness</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Execute a simulated live Java JDBC invocation cycle with DriverManager and ResultSet mapping.
            </p>

            <button
              onClick={handleRunJdbcTest}
              disabled={isRunningTest}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunningTest ? 'Running JDBC...' : 'Run JDBC DAO Test'}</span>
            </button>
          </div>
        </div>

        {/* Code Viewer (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden flex flex-col font-mono text-xs">
            {/* Code Header Bar */}
            <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-white font-semibold">{selectedFile.filename}</span>
                <span className="text-slate-500 mx-2">·</span>
                <span className="text-slate-400 text-[11px] font-sans">{selectedFile.path}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 font-sans text-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Code Display */}
            <pre className="p-5 overflow-x-auto text-slate-200 text-xs leading-relaxed max-h-[600px] overflow-y-auto">
              <code>{selectedFile.code}</code>
            </pre>
          </div>

          {/* Test Output Console */}
          {testOutput && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs shadow-sm">
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                <Terminal className="w-4 h-4" />
                <span>Standard Output (stdout)</span>
              </div>
              <pre className="text-slate-300 text-[11px] whitespace-pre-wrap leading-relaxed">
                {testOutput}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
