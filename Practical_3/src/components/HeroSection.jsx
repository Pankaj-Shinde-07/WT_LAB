import React from 'react';
import { Briefcase, Users, ShieldCheck, Sparkles } from 'lucide-react';
import { JOB_ROLES } from '../utils/validation';

export default function HeroSection({ applicationCount }) {
  return (
    <section className="hero-section">
      <div className="hero-inner">
        <div className="hero-text-content">
          <div className="hero-pill-badge">
            <Sparkles size={14} className="sparkle-icon" />
            <span>CAREER OPPORTUNITIES</span>
          </div>

          <h1 className="hero-heading">Take the next step in your career.</h1>
          
          <p className="hero-description">
            Share your details and apply for a role that matches your skills, education and ambitions.
            Designed with comprehensive ReactJS client-side validation and interactive feedback.
          </p>

          <div className="hero-stats-grid">
            <div className="stat-card">
              <span className="stat-number">{applicationCount}</span>
              <span className="stat-label">Applications submitted</span>
            </div>

            <div className="stat-card">
              <span className="stat-number">{JOB_ROLES.length}</span>
              <span className="stat-label">Career paths</span>
            </div>

            <div className="stat-card highlight">
              <span className="stat-number">
                <ShieldCheck size={28} className="shield-icon" />
              </span>
              <span className="stat-label">Real-time Validated</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
