// server.js - Practical No. 05: Web Application Framework with ExpressJS
// Developed by: Pankaj Shinde (PRN: 202401100005) - MIT Academy of Engineering

const express = require('express');
const cors = require('cors');
const path = require('path');

const appointmentRoutes = require('./routes/appointmentRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Built-in and Third-Party Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 2. Request Logging Middleware (Demonstrating Express Middleware Concept)
app.use((req, res, next) => {
  console.log(`[Express.js] ${req.method} ${req.originalUrl} - ${new Date().toLocaleTimeString()}`);
  next();
});

// 3. Mount Modular Express Routers
app.use('/api/appointments', appointmentRoutes);
app.use('/api/stats', statsRoutes);

// 4. Default Home Route serving frontend client
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 5. 404 Route Handler Middleware
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found on this Express server.`
  });
});

// 6. Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Express Server Error]', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error encountered in Express pipeline.'
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  Practical 05: ExpressJS Clinical Server Running!`);
  console.log(`  Local URL: http://localhost:${PORT}`);
  console.log(`  Student: Pankaj Shinde (PRN: 202401100005)`);
  console.log(`=======================================================`);
});
