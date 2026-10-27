import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Trash2, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  GraduationCap, 
  Briefcase, 
  ExternalLink, 
  Calendar, 
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import { JOB_ROLES } from '../utils/validation';

export default function ApplicationList({ applications, onDeleteApplication, onClearAll }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');

  // Filtered applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.mobile.includes(searchQuery) ||
        app.jobRole.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = selectedRole === 'ALL' || app.jobRole === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [applications, searchQuery, selectedRole]);

  // Role color palette generator
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Software Developer':
      case 'Full Stack Engineer':
        return 'role-badge-blue';
      case 'Frontend Engineer':
      case 'UI/UX Designer':
        return 'role-badge-purple';
      case 'Data Analyst':
      case 'AI / ML Engineer':
        return 'role-badge-emerald';
      case 'Cloud Architect':
      case 'DevOps Engineer':
        return 'role-badge-cyan';
      default:
        return 'role-badge-amber';
    }
  };

  return (
    <section className="applications-section">
      <div className="applications-header-row">
        <div>
          <span className="section-eyebrow">YOUR ACTIVITY</span>
          <div className="section-title-wrap">
            <h2 className="section-title">Submitted applications</h2>
            <span className="total-count-badge">
              {applications.length} {applications.length === 1 ? 'total' : 'total'}
            </span>
          </div>
        </div>

        {applications.length > 0 && (
          <button
            type="button"
            className="btn btn-danger-outline clear-all-btn"
            onClick={onClearAll}
            title="Remove all applications from browser storage"
          >
            <Trash2 size={15} />
            <span>Clear all</span>
          </button>
        )}
      </div>

      {/* Search & Filter Toolbar */}
      {applications.length > 0 && (
        <div className="filter-toolbar">
          <div className="search-input-wrap">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, role, email, or mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                type="button" 
                className="clear-search-btn" 
                onClick={() => setSearchQuery('')}
              >
                ×
              </button>
            )}
          </div>

          <div className="role-filter-wrap">
            <Filter size={15} className="filter-icon" />
            <select
              className="role-filter-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="ALL">All Roles ({applications.length})</option>
              {JOB_ROLES.map((role) => {
                const count = applications.filter((a) => a.jobRole === role).length;
                return (
                  <option key={role} value={role}>
                    {role} {count > 0 ? `(${count})` : ''}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      )}

      {/* Applications Cards Grid or Empty State */}
      {filteredApplications.length > 0 ? (
        <div className="applications-grid">
          {filteredApplications.map((app) => {
            const initial = app.fullName.trim().charAt(0).toUpperCase() || 'A';
            return (
              <article key={app.id} className="application-card fade-in">
                <div className="card-top-row">
                  <div className="card-applicant-info">
                    <div className="applicant-avatar" aria-hidden="true">
                      {initial}
                    </div>
                    <div>
                      <h3 className="applicant-name">{app.fullName}</h3>
                      <div className="applicant-tags">
                        <span className={`role-pill ${getRoleBadgeClass(app.jobRole)}`}>
                          <Briefcase size={12} />
                          {app.jobRole}
                        </span>
                        <span className="edu-pill">
                          <GraduationCap size={12} />
                          {app.education}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="delete-card-btn"
                    onClick={() => onDeleteApplication(app.id, app.fullName)}
                    title={`Delete application for ${app.fullName}`}
                  >
                    <Trash2 size={15} />
                    <span>Delete</span>
                  </button>
                </div>

                <div className="card-meta-details">
                  <div className="meta-item">
                    <Mail size={14} className="meta-icon" />
                    <a href={`mailto:${app.email}`} className="meta-link">
                      {app.email}
                    </a>
                  </div>

                  <div className="meta-item">
                    <Phone size={14} className="meta-icon" />
                    <span>+91 {app.mobile}</span>
                  </div>

                  <div className="meta-item">
                    <Calendar size={14} className="meta-icon" />
                    <span>{app.experience === 0 ? 'Fresher (0 yrs)' : `${app.experience} yrs experience`}</span>
                    <span className="meta-dot">•</span>
                    <span className="timestamp-text">{app.submittedAt}</span>
                  </div>
                </div>

                {app.resumeUrl && (
                  <div className="card-resume-row">
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resume-link"
                    >
                      <ExternalLink size={13} />
                      <span>View resume link</span>
                    </a>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : applications.length > 0 ? (
        <div className="empty-search-state">
          <p>No applications match your filter criteria.</p>
          <button 
            type="button" 
            className="btn btn-outline" 
            onClick={() => { setSearchQuery(''); setSelectedRole('ALL'); }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="empty-state-box">
          <div className="empty-icon-wrap">
            <FolderOpen size={36} className="empty-icon" />
          </div>
          <h3 className="empty-title">No applications yet</h3>
          <p className="empty-desc">
            Complete the form above to add your first job application and verify client-side validation.
          </p>
        </div>
      )}
    </section>
  );
}
