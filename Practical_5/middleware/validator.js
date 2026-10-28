// middleware/validator.js - Express Server-Side Validation Middleware
// Developed by: Pankaj Shinde (PRN: 202401100005) - MIT Academy of Engineering

const VALID_DEPARTMENTS = [
  'Cardiology',
  'Orthopedics',
  'Neurology',
  'Pediatrics',
  'Dermatology',
  'General Medicine'
];

const VALID_GENDERS = ['Male', 'Female', 'Other'];

/**
 * Express Middleware to perform Server-Side Validation on patient booking requests
 */
function validateAppointmentMiddleware(req, res, next) {
  const data = req.body || {};
  const errors = {};
  const sanitized = {};

  // 1. Patient Name: >= 3 characters, alphabetic
  const name = typeof data.patientName === 'string' ? data.patientName.trim() : '';
  if (!name) {
    errors.patientName = 'Patient full name is required.';
  } else if (name.length < 3) {
    errors.patientName = 'Patient name must contain at least 3 characters.';
  } else if (!/^[a-zA-Z\s.]+$/.test(name)) {
    errors.patientName = 'Patient name can only contain letters, spaces, and periods.';
  } else {
    sanitized.patientName = name;
  }

  // 2. Age: Integer between 1 and 120
  const ageNum = parseInt(data.age, 10);
  if (data.age === undefined || data.age === '' || isNaN(ageNum)) {
    errors.age = 'Patient age is required and must be an integer.';
  } else if (ageNum < 1 || ageNum > 120) {
    errors.age = 'Age must be between 1 and 120 years.';
  } else {
    sanitized.age = ageNum;
  }

  // 3. Gender: One of allowed values
  const gender = typeof data.gender === 'string' ? data.gender.trim() : '';
  if (!gender) {
    errors.gender = 'Gender selection is required.';
  } else if (!VALID_GENDERS.includes(gender)) {
    errors.gender = 'Please select a valid gender option.';
  } else {
    sanitized.gender = gender;
  }

  // 4. Contact Email: Regex validation
  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.email = 'Contact email address is required.';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Please provide a valid email address (e.g. name@example.com).';
  } else {
    sanitized.email = email;
  }

  // 5. Phone: 10-digit Indian Mobile regex
  const phone = typeof data.phone === 'string' ? data.phone.trim() : String(data.phone || '').trim();
  if (!phone) {
    errors.phone = 'Mobile contact number is required.';
  } else if (!/^[6-9]\d{9}$/.test(phone)) {
    errors.phone = 'Enter a valid 10-digit Indian mobile number beginning with 6-9.';
  } else {
    sanitized.phone = phone;
  }

  // 6. Clinical Department: Must match allowed list
  const department = typeof data.department === 'string' ? data.department.trim() : '';
  if (!department) {
    errors.department = 'Specialist medical department selection is required.';
  } else if (!VALID_DEPARTMENTS.includes(department)) {
    errors.department = 'Selected department is not recognized in our clinical directory.';
  } else {
    sanitized.department = department;
  }

  // 7. Appointment Date: Must be a future date (cannot book past dates!)
  const dateStr = typeof data.date === 'string' ? data.date.trim() : '';
  if (!dateStr) {
    errors.date = 'Appointment date is required.';
  } else {
    const inputDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(inputDate.getTime())) {
      errors.date = 'Invalid date format provided.';
    } else if (inputDate < today) {
      errors.date = 'Appointment date cannot be in the past. Please select today or a future date.';
    } else {
      sanitized.date = dateStr;
    }
  }

  // 8. Time Slot: Non-empty
  const timeSlot = typeof data.timeSlot === 'string' ? data.timeSlot.trim() : '';
  if (!timeSlot) {
    errors.timeSlot = 'Preferred appointment time slot is required.';
  } else {
    sanitized.timeSlot = timeSlot;
  }

  // 9. Symptoms / Reason for Visit: Min 10 characters
  const symptoms = typeof data.symptoms === 'string' ? data.symptoms.trim() : '';
  if (!symptoms) {
    errors.symptoms = 'Clinical symptoms or reason for visit is required.';
  } else if (symptoms.length < 10) {
    errors.symptoms = 'Please describe symptoms with at least 10 characters of detail.';
  } else {
    sanitized.symptoms = symptoms;
  }

  // If validation fails, halt pipeline and return HTTP 400 Bad Request
  if (Object.keys(errors).length > 0) {
    console.log(`[Express Validation Middleware] Request rejected with ${Object.keys(errors).length} errors.`);
    return res.status(400).json({
      success: false,
      message: 'Express Server-Side Validation Failed. Correct the highlighted inputs.',
      errors
    });
  }

  // Attach sanitized data to request and proceed to route handler
  req.validatedAppointment = sanitized;
  next();
}

module.exports = {
  validateAppointmentMiddleware,
  VALID_DEPARTMENTS,
  VALID_GENDERS
};
