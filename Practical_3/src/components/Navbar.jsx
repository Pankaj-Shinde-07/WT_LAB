import React from 'react';
import { Briefcase, Code, FileText, CheckCircle2 } from 'lucide-react';

export default function Navbar({ onOpenJson, onOpenTestCases, totalCount }) {
  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Brand / Logo */}
        <div className="navbar-brand">
          <div className="brand-logo-badge">
            <Briefcase size={22} className="brand-icon" />
          </div>
          <div className="brand-titles">
            <span className="brand-name">JobApply</span>
            <span className="brand-subtitle">ReactJS Practical No. 3</span>
          </div>
        </div>

        {/* Student & Academic Meta Info */}
        <div className="navbar-student-info">
          <span className="student-badge">
            <span className="student-dot"></span>
            <strong>Pankaj Shinde</strong> (PRN: 202401100005) • Div A
          </span>
        </div>

        {/* Action Controls */}
        <div className="navbar-actions">
          <button 
            type="button" 
            className="nav-btn test-suite-btn"
            onClick={onOpenTestCases}
            title="Open Practical 3 Test Cases (T1 - T14)"
          >
            <CheckCircle2 size={16} />
            <span>Test Suite (T1–T14)</span>
          </button>

          <button 
            type="button" 
            className="nav-btn json-btn"
            onClick={onOpenJson}
            title="View Raw LocalStorage JSON Data"
          >
            <Code size={16} />
            <span>JSON State</span>
            <span className="count-pill">{totalCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
