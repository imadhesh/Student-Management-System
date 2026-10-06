import React, { useState, useEffect } from 'react';
import { Terminal, X, Trash2, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Code2 } from 'lucide-react';
import { jdbcPool } from '../jdbc/JDBCConnection';
import { JdbcLogEntry } from '../types';

interface JdbcLiveLogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JdbcLiveLog: React.FC<JdbcLiveLogProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<JdbcLogEntry[]>([]);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [filterDao, setFilterDao] = useState<string>('ALL');

  useEffect(() => {
    setLogs(jdbcPool.getLogs());
    const unsubscribe = jdbcPool.subscribe(newLog => {
      setLogs(prev => [newLog, ...prev.slice(0, 99)]);
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const filteredLogs = logs.filter(log => {
    if (filterDao === 'ALL') return true;
    return log.daoMethod.toLowerCase().includes(filterDao.toLowerCase());
  });

  return (
    <aside
      aria-label="JDBC Wire Protocol & Transaction Console"
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 text-slate-100 border-t border-slate-700 shadow-2xl max-h-96 flex flex-col font-mono text-xs transition-all duration-200"
    >
      {/* Console Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-200">JDBC Driver & MySQL Wire Console</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">{logs.length} operations</span>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5">
            <span className="text-slate-500 text-[10px] uppercase font-sans">Filter:</span>
            {['ALL', 'Student', 'Grade', 'Attendance'].map(filter => (
              <button
                key={filter}
                onClick={() => setFilterDao(filter)}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                  filterDao === filter
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              jdbcPool.clearLogs();
              setLogs([]);
            }}
            title="Clear Log"
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            title="Close Console"
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Log Stream */}
      <div className="overflow-y-auto flex-1 divide-y divide-slate-800/60 p-2 space-y-1">
        {filteredLogs.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            No JDBC queries logged yet for this filter. Trigger actions in the UI to watch SQL statements stream here!
          </div>
        ) : (
          filteredLogs.map(log => {
            const isExpanded = expandedLogId === log.id;
            return (
              <div
                key={log.id}
                className="bg-slate-900/90 hover:bg-slate-800/80 rounded border border-slate-800/80 transition-colors p-2"
              >
                <div
                  className="flex items-start justify-between cursor-pointer gap-2"
                  onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                >
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    {log.status === 'SUCCESS' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    )}

                    <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                    <span className="text-blue-400 font-semibold">{log.daoMethod}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400 text-[11px] truncate max-w-md" title={log.sql}>
                      {log.sql}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-slate-400 text-[11px]">
                    <span className="text-amber-400">{log.executionTimeMs}ms</span>
                    {log.rowsAffected !== undefined && (
                      <span className="text-slate-400">({log.rowsAffected} rows)</span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>

                {/* Expanded Details: Bound params & Java code snippet */}
                {isExpanded && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800 space-y-2 text-[11px]">
                    {log.params.length > 0 && (
                      <div>
                        <div className="text-slate-400 font-sans font-medium text-[10px] uppercase tracking-wider mb-1">
                          Bound Parameters (?)
                        </div>
                        <div className="bg-slate-950 p-2 rounded text-emerald-300 font-mono overflow-x-auto">
                          {log.params.map((p, idx) => (
                            <span key={idx} className="mr-3">
                              <span className="text-slate-500">?{idx + 1}:</span> {JSON.stringify(p)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-1 text-slate-400 font-sans font-medium text-[10px] uppercase tracking-wider mb-1">
                        <Code2 className="w-3 h-3 text-blue-400" />
                        <span>Equivalent Java JDBC Code</span>
                      </div>
                      <pre className="bg-slate-950 p-2.5 rounded text-slate-300 overflow-x-auto text-[10px] leading-relaxed border border-slate-800">
                        <code>{log.javaCode}</code>
                      </pre>
                    </div>

                    {log.errorMessage && (
                      <div className="text-rose-400 bg-rose-950/40 border border-rose-900/50 p-2 rounded">
                        <strong>SQLException:</strong> {log.errorMessage}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
