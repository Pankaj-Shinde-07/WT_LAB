/**
 * Client-Side Validation Logic for JobApply Portal
 * Complies with Practical No. 3 specifications
 */

export const JOB_ROLES = [
  'Software Developer',
  'Frontend Engineer',
  'Backend Developer',
  'Full Stack Engineer',
  'Data Analyst',
  'Cloud Architect',
  'UI/UX Designer',
  'DevOps Engineer',
  'Cybersecurity Analyst',
  'AI / ML Engineer',
];

export const EDUCATION_LEVELS = [
  "Bachelor's Degree",
  "Master's Degree",
  'Diploma in Engineering',
  'Doctorate / Ph.D.',
  'Higher Secondary (12th)',
];

export const initialFormData = {
  fullName: '',
  email: '',
  mobile: '',
  jobRole: '',
  education: '',
  experience: '',
  resumeUrl: '',
};

/**
 * Validates a single field
 * @param {string} name - Field name
 * @param {string} value - Field value
 * @returns {string} Error message or empty string
 */
export function validateField(name, value) {
  const val = typeof value === 'string' ? value.trim() : value;

  switch (name) {
    case 'fullName':
      if (!val) return 'Full name is required.';
      if (val.length < 3) return 'Name must contain at least 3 characters.';
      if (!/^[a-zA-Z\s\.\-']+$/.test(val)) return 'Name should only contain letters and spaces.';
      return '';

    case 'email':
      if (!val) return 'Email address is required.';
      // Robust standard email pattern
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val)) {
        return 'Please enter a valid email address (e.g. you@example.com).';
      }
      return '';

    case 'mobile':
      if (!val) return 'Mobile number is required.';
      // 10-digit Indian mobile pattern starting with 6, 7, 8, or 9
      if (!/^[6-9]\d{9}$/.test(val)) {
        return 'Enter a valid 10-digit Indian mobile number beginning with 6–9.';
      }
      return '';

    case 'jobRole':
      if (!val) return 'Please select a job role.';
      return '';

    case 'education':
      if (!val) return 'Please select your education.';
      return '';

    case 'experience':
      if (val === '' || val === null || val === undefined) {
        return 'Experience is required (enter 0 for fresher).';
      }
      const numExp = Number(val);
      if (isNaN(numExp)) {
        return 'Experience must be a valid number.';
      }
      if (numExp < 0 || numExp > 50) {
        return 'Experience must be a finite number between 0 and 50 years.';
      }
      return '';

    case 'resumeUrl':
      // Resume URL is optional; validate only if provided
      if (val && !/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(val)) {
        return 'Enter a valid HTTP or HTTPS URL (e.g. https://example.com/resume).';
      }
      return '';

    default:
      return '';
  }
}

/**
 * Validates the entire form and returns an errors object
 * @param {object} data - Form data
 * @returns {object} Errors map
 */
export function validateForm(data) {
  const errors = {};

  const nameError = validateField('fullName', data.fullName);
  if (nameError) errors.fullName = nameError;

  const emailError = validateField('email', data.email);
  if (emailError) errors.email = emailError;

  const mobileError = validateField('mobile', data.mobile);
  if (mobileError) errors.mobile = mobileError;

  const roleError = validateField('jobRole', data.jobRole);
  if (roleError) errors.jobRole = roleError;

  const eduError = validateField('education', data.education);
  if (eduError) errors.education = eduError;

  const expError = validateField('experience', data.experience);
  if (expError) errors.experience = expError;

  const resumeError = validateField('resumeUrl', data.resumeUrl);
  if (resumeError) errors.resumeUrl = resumeError;

  return errors;
}
