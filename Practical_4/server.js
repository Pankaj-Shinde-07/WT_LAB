// server.js - Practical No. 04: Server-Side Development with Pure NodeJS
// Developed by: Pankaj Shinde (PRN: 202401100005) - MIT Academy of Engineering

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const querystring = require('querystring');

const { validateStudent, ALLOWED_DEPARTMENTS, ALLOWED_COURSES } = require('./modules/validator');
const { getAllStudents, saveStudent, deleteStudent } = require('./modules/storage');

const PORT = process.env.PORT || 4000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// MIME types lookup table for pure Node static serving
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Helper to send standardized JSON responses
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

// Helper to parse incoming request body stream
function parseRequestBody(req, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
    // Guard against oversized payload attacks
    if (body.length > 1e6) {
      req.connection.destroy();
    }
  });

  req.on('end', () => {
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('application/json')) {
      try {
        const parsed = JSON.parse(body || '{}');
        callback(null, parsed);
      } catch (err) {
        callback(err, null);
      }
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const parsed = querystring.parse(body);
      callback(null, parsed);
    } else {
      // Fallback try JSON or raw string
      try {
        const parsed = JSON.parse(body || '{}');
        callback(null, parsed);
      } catch {
        callback(null, querystring.parse(body));
      }
    }
  });
}

// Pure Node.js HTTP Server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // Handle CORS pre-flight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  console.log(`[NodeJS HTTP Server] ${method} ${pathname}`);

  // ─── REST API ROUTES ─────────────────────────────────────────────────────────

  // 1. GET /api/stats - Aggregate enrollment metrics
  if (method === 'GET' && pathname === '/api/stats') {
    const students = getAllStudents();
    const deptCounts = {};
    students.forEach(s => {
      deptCounts[s.department] = (deptCounts[s.department] || 0) + 1;
    });
    return sendJSON(res, 200, {
      success: true,
      totalRegistered: students.length,
      allowedDepartments: ALLOWED_DEPARTMENTS,
      allowedCourses: ALLOWED_COURSES,
      departmentBreakdown: deptCounts
    });
  }

  // 2. GET /api/students - Retrieve all registered students
  if (method === 'GET' && pathname === '/api/students') {
    const students = getAllStudents();
    return sendJSON(res, 200, {
      success: true,
      count: students.length,
      students
    });
  }

  // 3. POST /api/register - Server-Side Validation & Enrollment
  if (method === 'POST' && pathname === '/api/register') {
    return parseRequestBody(req, (err, rawData) => {
      if (err) {
        return sendJSON(res, 400, {
          success: false,
          error: 'Malformed JSON payload received by Node.js server.'
        });
      }

      // Execute Server-Side Validation Module
      const validation = validateStudent(rawData);

      // If Server-Side Validation FAILS: return HTTP 400 with field errors
      if (!validation.isValid) {
        console.log(`[Validation Failed] Form rejected with ${Object.keys(validation.errors).length} errors.`);
        return sendJSON(res, 400, {
          success: false,
          message: 'Server-side validation failed. Please correct highlighted inputs.',
          errors: validation.errors
        });
      }

      // If Server-Side Validation PASSES: persist student record
      const newStudent = {
        id: 'std_' + Date.now(),
        ...validation.sanitized,
        registeredAt: new Date().toISOString().split('T')[0]
      };

      saveStudent(newStudent);
      console.log(`[Validation Passed] Successfully enrolled student: ${newStudent.name} (PRN: ${newStudent.prn})`);

      return sendJSON(res, 201, {
        success: true,
        message: 'Student course enrollment successfully validated and recorded by Node.js server!',
        student: newStudent
      });
    });
  }

  // 4. DELETE /api/students/:id - Remove a student record
  if (method === 'DELETE' && pathname.startsWith('/api/students/')) {
    const studentId = pathname.replace('/api/students/', '');
    const deleted = deleteStudent(studentId);
    if (deleted) {
      return sendJSON(res, 200, { success: true, message: 'Student record deleted from storage.' });
    }
    return sendJSON(res, 404, { success: false, error: 'Student record not found.' });
  }

  // ─── STATIC FILE SERVING ───────────────────────────────────────────────────
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(`
        <div style="font-family:sans-serif; text-align:center; padding:3rem;">
          <h1>404 — Resource Not Found</h1>
          <p>The requested route <code>${pathname}</code> does not exist on this Node.js HTTP server.</p>
          <a href="/" style="color:#4f46e5; text-decoration:none; font-weight:bold;">← Return to Home</a>
        </div>
      `);
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  Practical 04: Pure NodeJS Server Running!`);
  console.log(`  Local URL: http://localhost:${PORT}`);
  console.log(`  Student: Pankaj Shinde (PRN: 202401100005)`);
  console.log(`=======================================================`);
});
