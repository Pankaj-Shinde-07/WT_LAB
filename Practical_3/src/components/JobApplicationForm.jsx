import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  GraduationCap, 
  Clock, 
  Link as LinkIcon, 
  AlertCircle, 
  CheckCircle, 
  Sparkles, 
  AlertTriangle,
  RotateCcw,
  Send,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  JOB_ROLES, 
  EDUCATION_LEVELS, 
  initialFormData, 
  validateField, 
  validateForm 
} from '../utils/validation';

export default function JobApplicationForm({ onAddApplication }) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [message, setMessage] = useState(null);

  // Handle controlled input changes with real-time validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If the field was already touched, validate in real time
    if (touched[name]) {
      const errorMsg = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: errorMsg,
      }));
    }
  };

  // Mark field as touched on blur and run validation
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const errorMsg = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(initialFormData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate entire form
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setMessage({
        type: 'warning',
        text: 'Please correct the highlighted fields before submitting.',
      });
      return;
    }

    // Submission succeeded
    const newRecord = {
      id: Date.now(),
      ...formData,
      experience: Number(formData.experience),
      submittedAt: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    };

    onAddApplication(newRecord);

    // Confetti celebration
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#2563eb', '#3b82f6', '#10b981', '#6366f1'],
      });
    } catch {
      // Fallback silently if canvas-confetti is unavailable
    }

    setMessage({
      type: 'success',
      text: `Application submitted successfully for "${formData.fullName.trim()}"! Record saved to browser localStorage.`,
    });

    // Reset form fields
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
  };

  // Reset form handler
  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
    setMessage({
      type: 'info',
      text: 'Form inputs have been cleared.',
    });
    setTimeout(() => setMessage(null), 3000);
  };

  // Quick fill helper for testing valid input (rubric & viva demo)
  const handleFillValidData = () => {
    const sample = {
      fullName: 'Pankaj Shinde',
      email: 'pankajshinde0409@gmail.com',
      mobile: '9823456789',
      jobRole: 'Software Developer',
      education: "Bachelor's Degree",
      experience: '2',
      resumeUrl: 'https://pankajshinde.dev/resume.pdf',
    };
    setFormData(sample);
    setErrors({});
    setTouched({});
    setMessage({
      type: 'info',
      text: '✨ Populated valid sample data. Click "Submit application" to test submission.',
    });
  };

  // Quick fill helper for testing invalid inputs
  const handleFillInvalidData = () => {
    const invalidSample = {
      fullName: 'Ab', // too short (< 3)
      email: 'pankaj@invalid', // missing domain TLD
      mobile: '123456', // invalid Indian mobile (not 10 digits & doesn't start with 6-9)
      jobRole: '', // not selected
      education: '', // not selected
      experience: '65', // out of range (> 50)
      resumeUrl: 'invalid-url-format', // invalid URL protocol
    };
    setFormData(invalidSample);
    
    // Automatically trigger validation so user immediately sees error states
    const validationErrors = validateForm(invalidSample);
    setErrors(validationErrors);
    const allTouched = Object.keys(initialFormData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    setMessage({
      type: 'warning',
      text: '⚠️ Sample invalid data populated. Observe field-level red outlines and specific error messages.',
    });
  };

  return (
    <div className="portal-main-grid">
      {/* Left Column: Form Card */}
      <div className="form-card-container">
        <div className="form-card-header">
          <div className="form-card-title-wrap">
            <div className="title-icon-badge">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="form-title">Job application</h2>
              <p className="form-subtitle">Complete the form below to register your interest</p>
            </div>
          </div>

          {/* Quick Demo Fill Buttons for Examiners */}
          <div className="quick-demo-actions">
            <button
              type="button"
              className="quick-fill-btn valid-btn"
              onClick={handleFillValidData}
              title="Auto-fill with valid test values"
            >
              <span>✨ Valid Demo</span>
            </button>
            <button
              type="button"
              className="quick-fill-btn invalid-btn"
              onClick={handleFillInvalidData}
              title="Auto-fill with invalid test values to test validation errors"
            >
              <span>⚠️ Invalid Demo</span>
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {message && (
          <div className={`message-banner banner-${message.type} fade-in`} role="alert">
            {message.type === 'warning' && <AlertTriangle size={18} className="banner-icon" />}
            {message.type === 'success' && <CheckCircle size={18} className="banner-icon" />}
            {message.type === 'info' && <HelpCircle size={18} className="banner-icon" />}
            <span className="banner-text">{message.text}</span>
            <button 
              type="button" 
              className="banner-close" 
              onClick={() => setMessage(null)}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="application-form">
          <div className="form-fields-grid">
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="fullName" className="field-label">
                Full name <span className="required-star">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className={`form-input ${errors.fullName ? 'input-error' : touched.fullName && !errors.fullName ? 'input-valid' : ''}`}
                  placeholder="e.g. Pankaj Shinde"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="name"
                />
                {touched.fullName && !errors.fullName && formData.fullName && (
                  <CheckCircle size={16} className="valid-icon-indicator" />
                )}
              </div>
              {errors.fullName && (
                <p className="field-error-msg fade-in" id="fullName-error">
                  <AlertCircle size={14} />
                  <span>{errors.fullName}</span>
                </p>
              )}
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label htmlFor="email" className="field-label">
                Email address <span className="required-star">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-input ${errors.email ? 'input-error' : touched.email && !errors.email ? 'input-valid' : ''}`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                />
                {touched.email && !errors.email && formData.email && (
                  <CheckCircle size={16} className="valid-icon-indicator" />
                )}
              </div>
              {errors.email && (
                <p className="field-error-msg fade-in" id="email-error">
                  <AlertCircle size={14} />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div className="form-group">
              <label htmlFor="mobile" className="field-label">
                Mobile number <span className="required-star">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  maxLength={10}
                  className={`form-input ${errors.mobile ? 'input-error' : touched.mobile && !errors.mobile ? 'input-valid' : ''}`}
                  placeholder="10-digit mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.mobile && !errors.mobile && formData.mobile && (
                  <CheckCircle size={16} className="valid-icon-indicator" />
                )}
              </div>
              {errors.mobile && (
                <p className="field-error-msg fade-in" id="mobile-error">
                  <AlertCircle size={14} />
                  <span>{errors.mobile}</span>
                </p>
              )}
            </div>

            {/* Job Role */}
            <div className="form-group">
              <label htmlFor="jobRole" className="field-label">
                Job role <span className="required-star">*</span>
              </label>
              <div className="input-wrapper">
                <select
                  id="jobRole"
                  name="jobRole"
                  className={`form-select ${errors.jobRole ? 'input-error' : touched.jobRole && !errors.jobRole ? 'input-valid' : ''}`}
                  value={formData.jobRole}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Select a role</option>
                  {JOB_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                {touched.jobRole && !errors.jobRole && formData.jobRole && (
                  <CheckCircle size={16} className="valid-icon-indicator select-indicator" />
                )}
              </div>
              {errors.jobRole && (
                <p className="field-error-msg fade-in" id="jobRole-error">
                  <AlertCircle size={14} />
                  <span>{errors.jobRole}</span>
                </p>
              )}
            </div>

            {/* Education */}
            <div className="form-group">
              <label htmlFor="education" className="field-label">
                Education <span className="required-star">*</span>
              </label>
              <div className="input-wrapper">
                <select
                  id="education"
                  name="education"
                  className={`form-select ${errors.education ? 'input-error' : touched.education && !errors.education ? 'input-valid' : ''}`}
                  value={formData.education}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Select education</option>
                  {EDUCATION_LEVELS.map((edu) => (
                    <option key={edu} value={edu}>
                      {edu}
                    </option>
                  ))}
                </select>
                {touched.education && !errors.education && formData.education && (
                  <CheckCircle size={16} className="valid-icon-indicator select-indicator" />
                )}
              </div>
              {errors.education && (
                <p className="field-error-msg fade-in" id="education-error">
                  <AlertCircle size={14} />
                  <span>{errors.education}</span>
                </p>
              )}
            </div>

            {/* Experience (years) */}
            <div className="form-group">
              <label htmlFor="experience" className="field-label">
                Experience (years) <span className="required-star">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="experience"
                  name="experience"
                  type="number"
                  min="0"
                  max="50"
                  step="1"
                  className={`form-input ${errors.experience ? 'input-error' : touched.experience && !errors.experience ? 'input-valid' : ''}`}
                  placeholder="e.g. 0 for fresher"
                  value={formData.experience}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.experience && !errors.experience && formData.experience !== '' && (
                  <CheckCircle size={16} className="valid-icon-indicator" />
                )}
              </div>
              {errors.experience && (
                <p className="field-error-msg fade-in" id="experience-error">
                  <AlertCircle size={14} />
                  <span>{errors.experience}</span>
                </p>
              )}
            </div>
          </div>

          {/* Resume URL (optional) */}
          <div className="form-group full-width-group">
            <label htmlFor="resumeUrl" className="field-label">
              Resume URL <span className="optional-tag">(optional)</span>
            </label>
            <div className="input-wrapper">
              <input
                id="resumeUrl"
                name="resumeUrl"
                type="url"
                className={`form-input ${errors.resumeUrl ? 'input-error' : touched.resumeUrl && !errors.resumeUrl && formData.resumeUrl ? 'input-valid' : ''}`}
                placeholder="https://example.com/my-resume"
                value={formData.resumeUrl}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.resumeUrl && !errors.resumeUrl && formData.resumeUrl && (
                <CheckCircle size={16} className="valid-icon-indicator" />
              )}
            </div>
            {errors.resumeUrl && (
              <p className="field-error-msg fade-in" id="resumeUrl-error">
                <AlertCircle size={14} />
                <span>{errors.resumeUrl}</span>
              </p>
            )}
          </div>

          <div className="required-note">
            <span className="required-star">*</span> Required fields
          </div>

          {/* Action Buttons */}
          <div className="form-action-buttons">
            <button type="submit" className="btn btn-primary submit-btn">
              <span>Submit application</span>
              <Send size={16} className="btn-icon" />
            </button>

            <button type="button" className="btn btn-outline reset-btn" onClick={handleReset}>
              <RotateCcw size={15} />
              <span>Clear form</span>
            </button>
          </div>
        </form>
      </div>

      {/* Right Column: Informational Sidebar */}
      <aside className="portal-sidebar">
        <div className="sidebar-card helper-card">
          <div className="sidebar-header">
            <div className="sidebar-sparkle">
              <Sparkles size={16} />
            </div>
            <h3 className="sidebar-title">Ready for your next opportunity?</h3>
          </div>
          <p className="sidebar-intro">
            Make sure your contact details are correct before submitting your application:
          </p>

          <ul className="guidelines-list">
            <li>
              <CheckCircle size={15} className="list-check" />
              <span>Full name has at least 3 characters</span>
            </li>
            <li>
              <CheckCircle size={15} className="list-check" />
              <span>Check your email address format</span>
            </li>
            <li>
              <CheckCircle size={15} className="list-check" />
              <span>Valid 10-digit Indian phone (starts 6–9)</span>
            </li>
            <li>
              <CheckCircle size={15} className="list-check" />
              <span>Select the correct job role & education</span>
            </li>
            <li>
              <CheckCircle size={15} className="list-check" />
              <span>Review your years of experience (0–50)</span>
            </li>
            <li>
              <CheckCircle size={15} className="list-check" />
              <span>Add your portfolio/resume link (optional)</span>
            </li>
          </ul>

          <div className="demo-notice-box">
            <h4 className="notice-heading">Demo Application</h4>
            <p className="notice-text">
              Applications are safely persisted in this browser via <code>localStorage</code> for academic demonstration. No external backend is connected.
            </p>
          </div>
        </div>

        {/* Academic Card */}
        <div className="sidebar-card academic-card">
          <div className="academic-badge">Academic Project</div>
          <h4 className="academic-title">WT Practical No. 3</h4>
          <p className="academic-dept">MIT Academy of Engineering, Pune</p>
          <div className="academic-divider"></div>
          <div className="student-meta">
            <div><strong>Student:</strong> Pankaj Shinde</div>
            <div><strong>PRN:</strong> 202401100005</div>
            <div><strong>Branch:</strong> Software Engineering (Div A)</div>
          </div>
        </div>
      </aside>
    </div>
  );
}
