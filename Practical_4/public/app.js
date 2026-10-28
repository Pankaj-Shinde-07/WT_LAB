// public/app.js - Client Controller for Practical No. 04 Pure NodeJS Portal

const formFields = ['name', 'prn', 'email', 'phone', 'department', 'semester', 'course', 'cgpa'];

function clearFieldErrors() {
  formFields.forEach(field => {
    const input = document.getElementById(field);
    const err = document.getElementById(`err_${field}`);
    if (input) input.classList.remove('input-error');
    if (err) err.textContent = '';
  });
  document.getElementById('errorBanner').style.display = 'none';
  document.getElementById('successBanner').style.display = 'none';
}

function resetForm() {
  document.getElementById('enrollmentForm').reset();
  clearFieldErrors();
  document.getElementById('receiptCard').style.display = 'none';
}

// 1. One-Click Valid Student Demo (For Teacher Viva Demonstration)
function fillValidDemo() {
  clearFieldErrors();
  document.getElementById('name').value = 'Pankaj Shinde';
  document.getElementById('prn').value = '202401100005';
  document.getElementById('email').value = 'pankaj.shinde@mitaoe.ac.in';
  document.getElementById('phone').value = '9823456789';
  document.getElementById('department').value = 'Software Engineering';
  document.getElementById('semester').value = 'Semester 5 (TY)';
  document.getElementById('course').value = 'Full-Stack Cloud Development';
  document.getElementById('cgpa').value = '9.25';
}

// 2. One-Click Invalid Input Demo (To demonstrate Server-Side Validation Rejection)
function fillInvalidDemo() {
  clearFieldErrors();
  document.getElementById('name').value = 'Al'; // Too short (< 3 chars)
  document.getElementById('prn').value = '12345'; // Invalid PRN (not 12 digits)
  document.getElementById('email').value = 'invalid-email-address'; // Malformed email
  document.getElementById('phone').value = '123456'; // Invalid mobile
  document.getElementById('department').value = ''; // Missing department
  document.getElementById('semester').value = ''; // Missing semester
  document.getElementById('course').value = ''; // Missing course
  document.getElementById('cgpa').value = '15.5'; // Out of range (> 10.0)
}

// 3. Load Registered Students List from Node.js API
async function loadStudents() {
  const tbody = document.getElementById('studentsTableBody');
  try {
    const res = await fetch('/api/students');
    const data = await res.json();
    const students = data.students || [];

    if (students.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem; color:#94a3b8;">No registered students yet.</td></tr>';
      return;
    }

    tbody.innerHTML = students.map(s => `
      <tr>
        <td><strong style="color:#1e3a8a;">${s.prn}</strong></td>
        <td><strong>${s.name}</strong></td>
        <td>${s.department}</td>
        <td><span style="background:#eff6ff; color:#1d4ed8; padding:0.2rem 0.6rem; border-radius:12px; font-size:0.78rem; font-weight:600;">${s.course}</span></td>
        <td>
          <div>${s.email}</div>
          <div style="font-size:0.78rem; color:#64748b;">📞 ${s.phone}</div>
        </td>
        <td><strong>${s.cgpa}</strong></td>
        <td>
          <button onclick="deleteStudentRecord('${s.id}')" class="btn-danger-sm" style="border:none; cursor:pointer;" title="Delete Record">
            🗑️ Delete
          </button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Error fetching students:', err);
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:red;">Failed to connect to Node.js server.</td></tr>';
  }
}

// 4. Delete Student Record
async function deleteStudentRecord(id) {
  if (!confirm('Are you sure you want to delete this student enrollment record?')) return;
  try {
    const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (res.ok && data.success) {
      loadStudents();
    }
  } catch (err) {
    console.error('Error deleting student:', err);
  }
}

// 5. Submit Form to Node.js Server
document.getElementById('enrollmentForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearFieldErrors();

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Node.js Server Validating Input...';

  const payload = {
    name: document.getElementById('name').value,
    prn: document.getElementById('prn').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    department: document.getElementById('department').value,
    semester: document.getElementById('semester').value,
    course: document.getElementById('course').value,
    cgpa: document.getElementById('cgpa').value
  };

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.status === 400 || !data.success) {
      // ⚠️ SERVER-SIDE VALIDATION FAILED
      const errBanner = document.getElementById('errorBanner');
      const errText = document.getElementById('errorText');
      errText.innerHTML = `<strong>⚠️ Server-Side Validation Rejection (HTTP 400 Bad Request):</strong><br/>${data.message || 'Validation errors detected.'}`;
      errBanner.style.display = 'flex';

      // Highlight invalid fields returned by Node.js server
      if (data.errors) {
        Object.keys(data.errors).forEach(field => {
          const input = document.getElementById(field);
          const errSpan = document.getElementById(`err_${field}`);
          if (input) input.classList.add('input-error');
          if (errSpan) errSpan.textContent = data.errors[field];
        });
      }
      errBanner.scrollIntoView({ behavior: 'smooth' });

    } else if (res.status === 201 && data.success) {
      // ✅ SERVER-SIDE VALIDATION PASSED
      const successBanner = document.getElementById('successBanner');
      const successText = document.getElementById('successText');
      successText.innerHTML = `<strong>🎉 Server-Side Validation Passed (HTTP 201 Created)!</strong><br/>${data.message}`;
      successBanner.style.display = 'flex';

      // Show verified receipt
      const std = data.student;
      const receiptCard = document.getElementById('receiptCard');
      const receiptContent = document.getElementById('receiptContent');
      receiptContent.innerHTML = `
        <div><strong>Student Name:</strong> ${std.name}</div>
        <div><strong>PRN:</strong> ${std.prn}</div>
        <div><strong>Email:</strong> ${std.email}</div>
        <div><strong>Department:</strong> ${std.department}</div>
        <div><strong>Enrolled Course:</strong> ${std.course}</div>
        <div><strong>Cumulative GPA:</strong> ${std.cgpa}</div>
        <div><strong>Timestamp:</strong> ${std.registeredAt}</div>
      `;
      receiptCard.style.display = 'block';

      // Reset form fields
      document.getElementById('enrollmentForm').reset();
      loadStudents();
      successBanner.scrollIntoView({ behavior: 'smooth' });
    }
  } catch (err) {
    console.error('Submission error:', err);
    alert('Network error connecting to Node.js server.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Enrollment to Node.js Server →';
  }
});

// Initial load
loadStudents();
