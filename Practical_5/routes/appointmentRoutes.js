// routes/appointmentRoutes.js - Express Router for Patient Appointments
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { validateAppointmentMiddleware } = require('../middleware/validator');

const DATA_FILE = path.join(__dirname, '..', 'data', 'appointments.json');

// Helper to read and write database
const readAppointments = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (err) {
    console.error('Error reading appointments:', err);
    return [];
  }
};

const writeAppointments = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

// Map departments to specialist doctors
const DOCTOR_MAP = {
  'Cardiology': 'Dr. Rajesh Sharma, MD (Cardiologist)',
  'Orthopedics': 'Dr. Vikram Joshi, MS (Orthopedic Surgeon)',
  'Neurology': 'Dr. Ananya Roy, DM (Neurologist)',
  'Pediatrics': 'Dr. Sneha Desai, MD (Pediatrician)',
  'Dermatology': 'Dr. Rohan Mehta, DVD (Dermatologist)',
  'General Medicine': 'Dr. Meera Iyer, MBBS (Physician)'
};

// 1. GET /api/appointments - List all appointments with optional filters
router.get('/', (req, res) => {
  const { department, status, search } = req.query;
  let appointments = readAppointments();

  if (department && department !== 'All') {
    appointments = appointments.filter(a => a.department.toLowerCase() === department.toLowerCase());
  }

  if (status && status !== 'All') {
    appointments = appointments.filter(a => a.status.toLowerCase() === status.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    appointments = appointments.filter(a =>
      a.patientName.toLowerCase().includes(q) ||
      a.phone.includes(q) ||
      a.email.toLowerCase().includes(q)
    );
  }

  res.status(200).json({
    success: true,
    count: appointments.length,
    appointments
  });
});

// 2. GET /api/appointments/:id - Single appointment by ID
router.get('/:id', (req, res) => {
  const appointments = readAppointments();
  const found = appointments.find(a => String(a.id) === String(req.params.id));
  if (!found) {
    return res.status(404).json({ success: false, error: 'Appointment record not found.' });
  }
  res.status(200).json({ success: true, appointment: found });
});

// 3. POST /api/appointments - Create appointment with Server-Side Validation Middleware
router.post('/', validateAppointmentMiddleware, (req, res) => {
  const validated = req.validatedAppointment;
  const appointments = readAppointments();

  const newAppointment = {
    id: 'apt_' + Date.now(),
    ...validated,
    doctor: DOCTOR_MAP[validated.department] || 'Assigned Duty Medical Officer',
    status: 'Confirmed',
    bookedAt: new Date().toISOString().split('T')[0]
  };

  appointments.unshift(newAppointment);
  writeAppointments(appointments);

  console.log(`[Express Route] New appointment confirmed for ${newAppointment.patientName} with ${newAppointment.doctor}`);

  res.status(201).json({
    success: true,
    message: 'Medical appointment successfully validated and booked via Express.js!',
    appointment: newAppointment
  });
});

// 4. PATCH /api/appointments/:id/status - Update appointment status
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  const allowed = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

  if (!status || !allowed.includes(status)) {
    return res.status(400).json({
      success: false,
      error: `Invalid status. Must be one of: ${allowed.join(', ')}`
    });
  }

  const appointments = readAppointments();
  const idx = appointments.findIndex(a => String(a.id) === String(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Appointment not found.' });
  }

  appointments[idx].status = status;
  appointments[idx].updatedAt = new Date().toISOString().split('T')[0];
  writeAppointments(appointments);

  res.status(200).json({
    success: true,
    message: `Appointment status updated to ${status}.`,
    appointment: appointments[idx]
  });
});

// 5. DELETE /api/appointments/:id - Cancel/Delete appointment
router.delete('/:id', (req, res) => {
  let appointments = readAppointments();
  const initialLen = appointments.length;
  appointments = appointments.filter(a => String(a.id) !== String(req.params.id));

  if (appointments.length === initialLen) {
    return res.status(404).json({ success: false, error: 'Appointment not found.' });
  }

  writeAppointments(appointments);
  res.status(200).json({ success: true, message: 'Appointment booking cancelled and removed.' });
});

module.exports = router;
