import React, { useState } from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Users, 
  Award, 
  CalendarCheck, 
  BookOpen, 
  Terminal, 
  Code2, 
  Download, 
  RotateCcw,
  Database,
  Activity,
  FileCode,
  Check
} from 'lucide-react';
import { exportJavaMavenZip, downloadSchemaSql } from '../utils/exportProject';
import { mysqlEngine } from '../database/mysqlEngine';

export type NavTab = 'dashboard' | 'students' | 'grades' | 'attendance' | 'courses' | 'sql' | 'jdbc';

interface NavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isLogOpen: boolean;
  onToggleLog: () => void;
  onResetDatabase: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  isLogOpen,
  onToggleLog,
  onResetDatabase
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadZip = async () => {
    setIsExporting(true);
    try {
      await exportJavaMavenZip();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  const handleDownloadSql = () => {
    downloadSchemaSql();
    setShowExportMenu(false);
  };

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'students', label: 'Students', icon: <Users className="w-4 h-4" /> },
    { id: 'grades', label: 'Grades & GPA', icon: <Award className="w-4 h-4" /> },
    { id: 'attendance', label: 'Attendance', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'courses', label: 'Courses', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'sql', label: 'MySQL Console', icon: <Terminal className="w-4 h-4" /> },
    { id: 'jdbc', label: 'JDBC Workbench', icon: <Code2 className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40">
      {/* Top Banner with Engine & Connection Metadata */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">StudentSphere</span>
                <span className="text-xs text-blue-400 font-mono hidden sm:inline">JDBC & MySQL</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>MySQL 8.0</span>
                <span>·</span>
                <span>HikariCP Pool (4/10 active)</span>
              </div>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            {/* JDBC Log Toggle */}
            <button
              onClick={onToggleLog}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                isLogOpen
                  ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title="Toggle Live JDBC Query Stream"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live JDBC Wire</span>
            </button>

            {/* Export Project Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 transition-colors"
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Exported!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-blue-400" />
                    <span>Export Project</span>
                  </>
                )}
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 text-xs z-50">
                  <div className="px-3 py-1.5 text-slate-400 font-medium border-b border-slate-700/60 uppercase tracking-wider text-[10px]">
                    Production Java & MySQL Artifacts
                  </div>
                  <button
                    onClick={handleDownloadZip}
                    disabled={isExporting}
                    className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-medium">Download Java Maven Project (.zip)</div>
                      <div className="text-[10px] text-slate-400">Includes pom.xml, DAOs, models & schema</div>
                    </div>
                  </button>
                  <button
                    onClick={handleDownloadSql}
                    className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-700 flex items-center gap-2 border-t border-slate-700/60"
                  >
                    <FileCode className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <div>
                      <div className="font-medium">Download schema.sql</div>
                      <div className="text-[10px] text-slate-400">MySQL DDL & seed records</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Reset Database */}
            <button
              onClick={() => {
                if (window.confirm('Reset MySQL database to factory default records? All manual changes will be refreshed.')) {
                  mysqlEngine.resetToDefaults();
                  onResetDatabase();
                }
              }}
              title="Reset to factory demo database"
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav aria-label="Main navigation" className="flex items-center space-x-1 overflow-x-auto pb-2 sm:pb-0 scrollbar-none border-t border-slate-800/80 pt-1">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
