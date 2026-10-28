// routes/statsRoutes.js - Express Router for HealthCare Statistics
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'appointments.json');

router.get('/', (req, res) => {
  try {
    const raw = fs.existsSync(DATA_FILE) ? fs.readFileSync(DATA_FILE, 'utf-8') : '[]';
    const appointments = JSON.parse(raw);

    const confirmed = appointments.filter(a => a.status === 'Confirmed').length;
    const completed = appointments.filter(a => a.status === 'Completed').length;
    const pending = appointments.filter(a => a.status === 'Pending').length;

    const departmentStats = {};
    appointments.forEach(a => {
      departmentStats[a.department] = (departmentStats[a.department] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      totalAppointments: appointments.length,
      confirmedSlots: confirmed,
      completedVisits: completed,
      pendingRequests: pending,
      departmentBreakdown: departmentStats
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to aggregate statistics.' });
  }
});

module.exports = router;
