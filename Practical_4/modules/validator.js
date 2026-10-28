// modules/validator.js - Pure Node.js Server-Side Validation Module

const ALLOWED_DEPARTMENTS = [
  'Software Engineering',
  'Computer Engineering',
  'Information Technology',
  'Electronics & Telecommunication',
  'Mechanical Engineering'
];

const ALLOWED_COURSES = [
  'Full-Stack Cloud Development',
  'Artificial Intelligence & ML',
  'DevOps & Microservices',
  'Cybersecurity & Network Defense',
  'Data Science & Analytics'
];

/**
 * Validates student enrollment request data on the server side
 * @param {Object} data Raw user input parsed from HTTP request stream
 * @returns {Object} { isValid: boolean, errors: Object, sanitized: Object }
 */
function validateStudent(data) {
  const errors = {};
  const sanitized = {};

  // 1. Full Name Validation: Required, >= 3 chars, letters and spaces only
  const rawName = typeof data.name === 'string' ? data.name.trim() : '';
  if (!rawName) {
    errors.name = 'Student full name is required.';
  } else if (rawName.length < 3) {
    errors.name = 'Full name must contain at least 3 characters.';
  } else if (!/^[a-zA-Z\s.]+$/.test(rawName)) {
    errors.name = 'Name can only contain letters, spaces, and dots.';
  } else {
    sanitized.name = rawName;
  }

  // 2. PRN Validation: Exactly 12 numeric digits
  const rawPrn = typeof data.prn === 'string' ? data.prn.trim() : String(data.prn || '').trim();
  if (!rawPrn) {
    errors.prn = 'PRN number is required.';
  } else if (!/^\d{12}$/.test(rawPrn)) {
    errors.prn = 'PRN must consist of exactly 12 numeric digits (e.g. 202401100005).';
  } else {
    sanitized.prn = rawPrn;
  }

  // 3. Email Address Validation: Standard email regex pattern
  const rawEmail = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!rawEmail) {
    errors.email = 'Institutional or personal email address is required.';
  } else if (!emailRegex.test(rawEmail)) {
    errors.email = 'Please provide a valid email format (e.g. student@mitaoe.ac.in).';
  } else {
    sanitized.email = rawEmail;
  }

  // 4. Mobile Number Validation: 10-digit Indian phone starting with 6-9
  const rawPhone = typeof data.phone === 'string' ? data.phone.trim() : String(data.phone || '').trim();
  if (!rawPhone) {
    errors.phone = 'Mobile contact number is required.';
  } else if (!/^[6-9]\d{9}$/.test(rawPhone)) {
    errors.phone = 'Enter a valid 10-digit Indian mobile number beginning with 6-9.';
  } else {
    sanitized.phone = rawPhone;
  }

  // 5. Department Validation: Must match allowed academic branches
  const rawDept = typeof data.department === 'string' ? data.department.trim() : '';
  if (!rawDept) {
    errors.department = 'Academic department selection is required.';
  } else if (!ALLOWED_DEPARTMENTS.includes(rawDept)) {
    errors.department = 'Invalid department selected from options.';
  } else {
    sanitized.department = rawDept;
  }

  // 6. Semester Validation
  const rawSem = typeof data.semester === 'string' ? data.semester.trim() : '';
  if (!rawSem) {
    errors.semester = 'Academic semester selection is required.';
  } else {
    sanitized.semester = rawSem;
  }

  // 7. Elective Course Validation
  const rawCourse = typeof data.course === 'string' ? data.course.trim() : '';
  if (!rawCourse) {
    errors.course = 'Elective course selection is required.';
  } else if (!ALLOWED_COURSES.includes(rawCourse)) {
    errors.course = 'Please select a valid approved elective course.';
  } else {
    sanitized.course = rawCourse;
  }

  // 8. Cumulative Grade Point Average (CGPA): Float 0.0 to 10.0
  const rawCgpa = typeof data.cgpa === 'string' ? data.cgpa.trim() : String(data.cgpa || '').trim();
  const cgpaNum = parseFloat(rawCgpa);
  if (!rawCgpa) {
    errors.cgpa = 'Cumulative GPA (CGPA) is required.';
  } else if (isNaN(cgpaNum) || cgpaNum < 0.0 || cgpaNum > 10.0) {
    errors.cgpa = 'CGPA must be a valid numeric score between 0.00 and 10.00.';
  } else {
    sanitized.cgpa = cgpaNum.toFixed(2);
  }

  const isValid = Object.keys(errors).length === 0;
  return { isValid, errors, sanitized };
}

module.exports = {
  validateStudent,
  ALLOWED_DEPARTMENTS,
  ALLOWED_COURSES
};
