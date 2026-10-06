import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  Database, 
  RotateCcw, 
  Copy, 
  Check, 
  Table, 
  Key, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';
import { mysqlEngine, SCHEMAS } from '../database/mysqlEngine';
import { SqlQueryResult } from '../types';

export const SqlConsole: React.FC = () => {
  const [queryInput, setQueryInput] = useState<string>(
    'SELECT s.roll_number, s.first_name, s.last_name, s.department, s.gpa FROM students s ORDER BY s.gpa DESC;'
  );
  const [result, setResult] = useState<SqlQueryResult | null>(() => {
    return mysqlEngine.executeSql(
      'SELECT s.roll_number, s.first_name, s.last_name, s.department, s.gpa FROM students s ORDER BY s.gpa DESC;'
    );
  });
  const [selectedTable, setSelectedTable] = useState<string>('students');
  const [copiedQuery, setCopiedQuery] = useState(false);

  const queryTemplates = [
    {
      title: 'Top Students by GPA',
      query: 'SELECT roll_number, first_name, last_name, department, gpa FROM students ORDER BY gpa DESC;'
    },
    {
      title: 'Students with Grades Join',
      query: 'SELECT * FROM students JOIN grades ON students.student_id = grades.student_id;'
    },
    {
      title: 'Attendance Sessions with Student Names',
      query: 'SELECT * FROM attendance JOIN students ON attendance.student_id = students.student_id;'
    },
    {
      title: 'Average Scores by Student',
      query: 'SELECT roll_number, first_name, last_name, department, gpa, AVG(score) FROM students GROUP BY student_id;'
    },
    {
      title: 'Describe Schema: students',
      query: 'DESCRIBE students;'
    },
    {
      title: 'Show Database Tables',
      query: 'SHOW TABLES;'
    }
  ];

  const handleRunQuery = () => {
    if (!queryInput.trim()) return;
    const res = mysqlEngine.executeSql(queryInput);
    setResult(res);
  };

  const handleCopyQuery = () => {
    navigator.clipboard.writeText(queryInput);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Interactive MySQL Terminal & Schema Explorer</h1>
          <p className="text-xs text-slate-500 mt-1">
            Execute ad-hoc SQL queries against the active database <code className="font-mono text-blue-600 bg-blue-50 px-1 py-0.5 rounded">student_management_db</code>.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>MySQL 8.0.35 Engine Ready</span>
        </div>
      </div>

      {/* Editor & Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SQL Editor Area (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden flex flex-col font-mono text-xs">
            {/* Editor Toolbar */}
            <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-slate-200">mysql&gt; student_management_db</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyQuery}
                  className="px-2.5 py-1 text-[11px] rounded bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1 font-sans"
                >
                  {copiedQuery ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedQuery ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleRunQuery}
                  className="px-3 py-1 text-xs font-semibold rounded bg-emerald-600 text-white hover:bg-emerald-500 transition-colors flex items-center gap-1.5 font-sans shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute SQL</span>
                </button>
              </div>
            </div>

            {/* SQL Input Area */}
            <textarea
              value={queryInput}
              onChange={e => setQueryInput(e.target.value)}
              rows={4}
              placeholder="Enter MySQL query (e.g. SELECT * FROM students;)"
              className="w-full bg-slate-900 text-emerald-400 p-4 focus:outline-none resize-y font-mono text-xs leading-relaxed"
            />
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <div className="font-semibold text-slate-800 flex items-center gap-2">
                <Table className="w-4 h-4 text-blue-600" />
                <span>Query Results</span>
              </div>
              {result && (
                <div className="text-slate-500 font-mono text-[11px]">
                  {result.error ? (
                    <span className="text-rose-600 font-semibold">Query Failed</span>
                  ) : (
                    <span>
                      {result.rowCount} rows in set ({result.executionTimeMs} ms)
                    </span>
                  )}
                </div>
              )}
            </div>

            {result?.error ? (
              <div className="p-6 bg-rose-50 border-l-4 border-rose-500 text-rose-800 text-xs font-mono">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>MySQL Execution Error 1064</span>
                </div>
                <div>{result.error}</div>
              </div>
            ) : result && result.rows.length > 0 ? (
              <div className="overflow-x-auto max-h-96">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0">
                    <tr>
                      {result.columns.map(col => (
                        <th key={col} className="px-4 py-2.5 text-left font-mono text-[11px]">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {result.rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        {result.columns.map(col => (
                          <td key={col} className="px-4 py-2 text-slate-800 whitespace-nowrap">
                            {row[col] !== undefined && row[col] !== null ? String(row[col]) : <span className="text-slate-400 italic">NULL</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                Empty set (0 rows returned).
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Query Templates & Schema Inspector (1 col) */}
        <div className="space-y-4">
          {/* Query Templates */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-xs">
            <div className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Query Templates</span>
            </div>
            <div className="space-y-1.5">
              {queryTemplates.map(tmpl => (
                <button
                  key={tmpl.title}
                  onClick={() => {
                    setQueryInput(tmpl.query);
                    const res = mysqlEngine.executeSql(tmpl.query);
                    setResult(res);
                  }}
                  className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <div className="font-medium text-[11px] text-slate-800">{tmpl.title}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{tmpl.query}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Database Schema Inspector */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-xs">
            <div className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-blue-600" />
              <span>Tables & Schema</span>
            </div>

            <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
              {Object.keys(SCHEMAS).map(tbl => (
                <button
                  key={tbl}
                  onClick={() => setSelectedTable(tbl)}
                  className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                    selectedTable === tbl
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tbl}
                </button>
              ))}
            </div>

            {/* Selected Table Fields */}
            {SCHEMAS[selectedTable] && (
              <div className="space-y-1 border border-slate-200 rounded-lg p-2.5 bg-slate-50 font-mono text-[11px]">
                <div className="text-[10px] font-sans font-bold text-slate-500 uppercase mb-1">
                  {selectedTable} columns
                </div>
                {SCHEMAS[selectedTable].columns.map(col => (
                  <div key={col.name} className="flex items-center justify-between text-slate-700 py-0.5 border-b border-slate-100 last:border-none">
                    <div className="flex items-center gap-1">
                      {col.isPrimary && <Key className="w-3 h-3 text-amber-500 shrink-0" />}
                      <span className={col.isPrimary ? 'font-bold text-slate-900' : ''}>{col.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{col.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
