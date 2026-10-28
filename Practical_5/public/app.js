// public/app.js - Client Controller for Practical No. 05 ExpressJS Portal

const fields = ['patientName', 'age', 'gender', 'email', 'phone', 'department', 'date', 'timeSlot', 'symptoms'];

function clearFieldErrors() {
  fields.forEach(f => {
    const input = document.getElementById(f);
    const err = document.getElementById(`err_${f}`);
    if (input) input.classList.remove('input-error');
    if (err) err.textContent = '';
  });
  document.getElementById('errorBanner').style.display = 'none';
  document.getElementById('successBanner').style.display = 'none';
}

function resetForm() {
  document.getElementById('appointmentForm').reset();
  clearFieldErrors();
  document.getElementById('appointmentReceiptCard').style.display = 'none';
}

// 1. One-Click Valid Patient Demo (For Teacher Demonstration)
function fillValidPatient() {
  clearFieldErrors();
  document.getElementById('patientName').value = 'Pankaj Shinde';
  document.getElementById('age').value = '21';
  document.getElementById('gender').value = 'Male';
  document.getElementById('email').value = 'pankajshinde0409@gmail.com';
  document.getElementById('phone').value = '9823456789';
  document.getElementById('department').value = 'Cardiology';

  // Set appointment date 7 days into future
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);
  document.getElementById('date').value = futureDate.toISOString().split('T')[0];

  document.getElementById('timeSlot').value = '10:30 AM - 11:00 AM';
  document.getElementById('symptoms').value = 'Routine cardiovascular checkup and ECG evaluation for student sports certificate.';
}

// 2. One-Click Invalid Demo (To demonstrate Express Server-Side Validation Rejection)
function fillInvalidPatient() {
  clearFieldErrors();
  document.getElementById('patientName').value = 'P'; // Too short (< 3 chars)
  document.getElementById('age').value = '150'; // Out of bounds (> 120)
  document.getElementById('gender').value = ''; // Missing
  document.getElementById('email').value = 'invalid-email-address'; // Bad email pattern
  document.getElementById('phone').value = '12345'; // Bad phone (< 10 digits)
  document.getElementById('department').value = ''; // Missing
  document.getElementById('date').value = '2020-01-01'; // Past date! (Invalid)
  document.getElementById('timeSlot').value = ''; // Missing
  document.getElementById('symptoms').value = 'Sick'; // Too short (< 10 chars)
}

// 3. Load Statistics from Express REST API
async function loadStats() {
  try {
    const res = await fetch('/api/stats');
    if (res.ok) {
      const data = await res.json();
      document.getElementById('stat_total').textContent = data.totalAppointments || 0;
      document.getElementById('stat_confirmed').textContent = data.confirmedSlots || 0;
      document.getElementById('stat_pending').textContent = data.pendingRequests || 0;
    }
  } catch (err) {
    console.error('Stats error:', err);
  }
}

// 4. Load Appointments Schedule from Express API
async function loadAppointments() {
  const tbody = document.getElementById('appointmentsTableBody');
  try {
    const res = await fetch('/api/appointments');
    const data = await res.json();
    const list = data.appointments || [];

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem; color:#94a3b8;">No scheduled appointments yet.</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(a => `
      <tr>
        <td>
          <div style="font-weight:700; color:#0f172a;">${a.patientName}</div>
          <div style="font-size:0.78rem; color:#64748b;">${a.gender}, ${a.age} Yrs | 📞 ${a.phone}</div>
        </td>
        <td>
          <div style="font-weight:600; color:#0f766e;">${a.department}</div>
          <div style="font-size:0.8rem; color:#475569;">👨‍⚕️ ${a.doctor}</div>
        </td>
        <td>
          <div style="font-weight:600;">📅 ${a.date}</div>
          <div style="font-size:0.78rem; color:#0284c7;">⏰ ${a.timeSlot}</div>
        </td>
        <td style="max-width:220px; font-size:0.82rem; color:#475569;">${a.symptoms}</td>
        <td>
          <select onchange="updateAppointmentStatus('${a.id}', this.value)" class="form-control" style="padding:0.3rem 0.6rem; font-size:0.8rem; width:130px; border-radius:15px; font-weight:600;">
            <option value="Confirmed" ${a.status === 'Confirmed' ? 'selected' : ''}>✅ Confirmed</option>
            <option value="Pending" ${a.status === 'Pending' ? 'selected' : ''}>⏳ Pending</option>
            <option value="Completed" ${a.status === 'Completed' ? 'selected' : ''}>🏥 Completed</option>
            <option value="Cancelled" ${a.status === 'Cancelled' ? 'selected' : ''}>❌ Cancelled</option>
          </select>
        </td>
        <td>
          <button onclick="cancelAppointment('${a.id}')" style="background:#fee2e2; color:#991b1b; border:none; padding:0.35rem 0.7rem; border-radius:6px; cursor:pointer; font-size:0.78rem;" title="Cancel & Delete">
            🗑️ Cancel
          </button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Load appointments error:', err);
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Failed to connect to Express server.</td></tr>';
  }
}

// 5. Update Status via Express PATCH Route
async function updateAppointmentStatus(id, newStatus) {
  try {
    const res = await fetch(`/api/appointments/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      loadStats();
    }
  } catch (err) {
    console.error('Update status error:', err);
  }
}

// 6. Delete Appointment via Express DELETE Route
async function cancelAppointment(id) {
  if (!confirm('Are you sure you want to cancel and delete this clinical appointment?')) return;
  try {
    const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
    if (res.ok) {
      loadAppointments();
      loadStats();
    }
  } catch (err) {
    console.error('Delete error:', err);
  }
}

// 7. Form Submission to Express API
document.getElementById('appointmentForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearFieldErrors();

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Express Middleware Validating...';

  const payload = {
    patientName: document.getElementById('patientName').value,
    age: document.getElementById('age').value,
    gender: document.getElementById('gender').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    department: document.getElementById('department').value,
    date: document.getElementById('date').value,
    timeSlot: document.getElementById('timeSlot').value,
    symptoms: document.getElementById('symptoms').value
  };

  try {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.status === 400 || !data.success) {
      // ⚠️ EXPRESS SERVER-SIDE VALIDATION REJECTION
      const errBanner = document.getElementById('errorBanner');
      const errText = document.getElementById('errorText');
      errText.innerHTML = `<strong>⚠️ Express Server-Side Validation Rejection (HTTP 400 Bad Request):</strong><br/>${data.message || 'Validation errors detected.'}`;
      errBanner.style.display = 'flex';

      if (data.errors) {
        Object.keys(data.errors).forEach(f => {
          const input = document.getElementById(f);
          const errSpan = document.getElementById(`err_${f}`);
          if (input) input.classList.add('input-error');
          if (errSpan) errSpan.textContent = data.errors[f];
        });
      }
      errBanner.scrollIntoView({ behavior: 'smooth' });

    } else if (res.status === 201 && data.success) {
      // ✅ EXPRESS SERVER-SIDE VALIDATION PASSED
      const successBanner = document.getElementById('successBanner');
      const successText = document.getElementById('successText');
      successText.innerHTML = `<strong>🎉 Express Server Validation Passed (HTTP 201 Created)!</strong><br/>${data.message}`;
      successBanner.style.display = 'flex';

      const apt = data.appointment;
      const receiptCard = document.getElementById('appointmentReceiptCard');
      const receiptDetails = document.getElementById('receiptDetails');
      receiptDetails.innerHTML = `
        <div><strong>Patient Name:</strong> ${apt.patientName} (${apt.gender}, ${apt.age} Yrs)</div>
        <div><strong>Assigned Specialist:</strong> ${apt.doctor}</div>
        <div><strong>Department:</strong> ${apt.department}</div>
        <div><strong>Scheduled Date & Slot:</strong> ${apt.date} at ${apt.timeSlot}</div>
        <div><strong>Contact Phone:</strong> ${apt.phone}</div>
        <div><strong>Consultation Reason:</strong> ${apt.symptoms}</div>
        <div><strong>Status:</strong> <span style="background:#ccfbf1; color:#0f766e; padding:0.15rem 0.5rem; border-radius:10px; font-weight:700;">${apt.status}</span></div>
      `;
      receiptCard.style.display = 'block';

      document.getElementById('appointmentForm').reset();
      loadAppointments();
      loadStats();
      successBanner.scrollIntoView({ behavior: 'smooth' });
    }
  } catch (err) {
    console.error('Submission error:', err);
    alert('Network error connecting to Express server.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Confirm Booking with Express.js Server →';
  }
});

// Initialize
loadStats();
loadAppointments();
