// public/app.js - Client Controller & Postman API Explorer for Practical No. 06

let allBooks = [];

function clearErrors() {
  ['title', 'author', 'genre', 'publicationYear', 'copies'].forEach(f => {
    const el = document.getElementById(f);
    const err = document.getElementById(`err_${f}`);
    if (el) el.classList.remove('input-error');
    if (err) err.textContent = '';
  });
  document.getElementById('errorBanner').style.display = 'none';
  document.getElementById('successBanner').style.display = 'none';
}

function resetAddForm() {
  document.getElementById('addBookForm').reset();
  clearErrors();
}

// 1. One-Click Valid Demo Filler (POST 201)
function fillValidDemo() {
  clearErrors();
  document.getElementById('title').value = "System Design Interview – An Insider's Guide";
  document.getElementById('author').value = "Alex Xu";
  document.getElementById('genre').value = "Software Engineering";
  document.getElementById('isbn').value = "979-8664653403";
  document.getElementById('publicationYear').value = "2020";
  document.getElementById('copies').value = "5";
}

// 2. One-Click Invalid Demo Filler (POST 400 Rejection)
function fillInvalidDemo() {
  clearErrors();
  document.getElementById('title').value = ""; // Missing title
  document.getElementById('author').value = ""; // Missing author
  document.getElementById('genre').value = ""; // Missing genre
  document.getElementById('publicationYear').value = "1200"; // Invalid year (< 1400)
  document.getElementById('copies').value = "-3"; // Invalid negative copies
}

// 3. Load Statistics (GET /api/stats)
async function loadStats() {
  try {
    const res = await fetch('/api/stats');
    if (res.ok) {
      const data = await res.json();
      document.getElementById('stat_total').textContent = data.totalBooks || 0;
      document.getElementById('stat_available').textContent = data.availableCopies || 0;
      document.getElementById('stat_issued').textContent = data.issuedCopies || 0;
    }
  } catch (err) {
    console.error('Stats error:', err);
  }
}

// 4. Load Books Catalog (GET /api/books)
async function loadBooksTable(query = '') {
  const tbody = document.getElementById('booksTableBody');
  try {
    const url = query ? `/api/books?search=${encodeURIComponent(query)}` : '/api/books';
    const res = await fetch(url);
    const result = await res.json();
    allBooks = result.data || [];

    if (allBooks.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem; color:#94a3b8;">No matching books in library database.</td></tr>';
      return;
    }

    tbody.innerHTML = allBooks.map(b => `
      <tr>
        <td><strong>#${b.id}</strong></td>
        <td>
          <div style="font-weight:700; color:#0f172a;">${b.title}</div>
          <div style="font-size:0.78rem; color:#64748b;">ISBN: ${b.isbn || 'N/A'} &bull; Published: ${b.publicationYear || 'N/A'}</div>
        </td>
        <td>${b.author}</td>
        <td><span style="background:#e0e7ff; color:#3730a3; padding:0.2rem 0.6rem; border-radius:12px; font-size:0.78rem; font-weight:600;">${b.genre}</span></td>
        <td>
          <span class="badge-status ${b.available ? 'status-available' : 'status-issued'}">
            ${b.available ? `In Stock (${b.copies})` : 'Out of Stock (0)'}
          </span>
        </td>
        <td>
          <div style="display:flex; gap:0.4rem;">
            <button onclick='openEditModal(${JSON.stringify(b).replace(/'/g, "&apos;")})' class="btn btn-secondary btn-sm" style="font-size:0.75rem; padding:0.25rem 0.55rem;" title="PUT Update">
              ✏️ Edit
            </button>
            <button onclick="deleteBookRecord(${b.id}, '${b.title.replace(/'/g, "\\'")}')" class="btn" style="background:#fee2e2; color:#dc2626; font-size:0.75rem; padding:0.25rem 0.55rem; border:none;" title="DELETE Record">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Books load error:', err);
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Failed to connect to REST API server.</td></tr>';
  }
}

function searchBooks() {
  const q = document.getElementById('tableSearch').value.trim();
  loadBooksTable(q);
}

// 5. CREATE (POST /api/books)
document.getElementById('addBookForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  const createBtn = document.getElementById('createBtn');
  createBtn.disabled = true;
  createBtn.textContent = 'Posting to /api/books...';

  const payload = {
    title: document.getElementById('title').value,
    author: document.getElementById('author').value,
    genre: document.getElementById('genre').value,
    isbn: document.getElementById('isbn').value,
    publicationYear: document.getElementById('publicationYear').value,
    copies: document.getElementById('copies').value
  };

  const start = performance.now();
  try {
    const res = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const elapsed = Math.round(performance.now() - start);
    const data = await res.json();

    updateApiConsole('POST /api/books', res.status, elapsed, data);

    if (res.status === 400 || !data.success) {
      const errBanner = document.getElementById('errorBanner');
      document.getElementById('errorText').innerHTML = `<strong>⚠️ HTTP 400 Bad Request:</strong> ${data.message || 'Validation failed.'}`;
      errBanner.style.display = 'flex';

      if (data.errors) {
        Object.keys(data.errors).forEach(f => {
          const input = document.getElementById(f);
          const errSpan = document.getElementById(`err_${f}`);
          if (input) input.classList.add('input-error');
          if (errSpan) errSpan.textContent = data.errors[f];
        });
      }
    } else if (res.status === 201) {
      const successBanner = document.getElementById('successBanner');
      document.getElementById('successText').innerHTML = `<strong>🎉 HTTP 201 Created:</strong> ${data.message}`;
      successBanner.style.display = 'flex';

      document.getElementById('addBookForm').reset();
      loadBooksTable();
      loadStats();
    }
  } catch (err) {
    console.error('POST error:', err);
  } finally {
    createBtn.disabled = false;
    createBtn.textContent = 'Execute POST /api/books (Create Record) →';
  }
});

// 6. UPDATE (PUT /api/books/:id)
function openEditModal(book) {
  document.getElementById('edit_id').value = book.id;
  document.getElementById('edit_title').value = book.title;
  document.getElementById('edit_author').value = book.author;
  document.getElementById('edit_genre').value = book.genre;
  document.getElementById('edit_copies').value = book.copies;
  document.getElementById('editModal').style.display = 'flex';
}

function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
}

document.getElementById('editBookForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('edit_id').value;
  const payload = {
    title: document.getElementById('edit_title').value,
    author: document.getElementById('edit_author').value,
    genre: document.getElementById('edit_genre').value,
    copies: document.getElementById('edit_copies').value
  };

  const start = performance.now();
  try {
    const res = await fetch(`/api/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const elapsed = Math.round(performance.now() - start);
    const data = await res.json();
    updateApiConsole(`PUT /api/books/${id}`, res.status, elapsed, data);

    if (res.ok) {
      closeEditModal();
      loadBooksTable();
      loadStats();
    }
  } catch (err) {
    console.error('PUT error:', err);
  }
});

// 7. DELETE (DELETE /api/books/:id)
async function deleteBookRecord(id, title) {
  if (!confirm(`Are you sure you want to delete "${title}" (ID: ${id}) from the database?`)) return;

  const start = performance.now();
  try {
    const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
    const elapsed = Math.round(performance.now() - start);
    const data = await res.json();

    updateApiConsole(`DELETE /api/books/${id}`, res.status, elapsed, data);

    if (res.ok) {
      loadBooksTable();
      loadStats();
    }
  } catch (err) {
    console.error('DELETE error:', err);
  }
}

// 8. Interactive Postman Console Live Tester
async function testApiEndpoint(type, endpoint) {
  const start = performance.now();
  try {
    let res, data;
    if (type === 'GET') {
      res = await fetch(endpoint);
      data = await res.json();
      const elapsed = Math.round(performance.now() - start);
      updateApiConsole(`GET ${endpoint}`, res.status, elapsed, data);
    } else if (type === 'POST_INVALID') {
      res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: '', author: '' })
      });
      data = await res.json();
      const elapsed = Math.round(performance.now() - start);
      updateApiConsole(`POST ${endpoint} [INVALID TEST]`, res.status, elapsed, data);
    }
  } catch (err) {
    console.error('API Test Error:', err);
  }
}

function updateApiConsole(reqTitle, status, latency, data) {
  const statusBadge = document.getElementById('consoleStatusBadge');
  statusBadge.textContent = `${status} ${status === 200 ? 'OK' : status === 201 ? 'Created' : status === 400 ? 'Bad Request' : status === 404 ? 'Not Found' : ''} (${latency}ms)`;
  
  if (status >= 200 && status < 300) {
    statusBadge.style.background = '#16a34a';
    statusBadge.style.color = '#fff';
  } else if (status === 400) {
    statusBadge.style.background = '#d97706';
    statusBadge.style.color = '#fff';
  } else {
    statusBadge.style.background = '#dc2626';
    statusBadge.style.color = '#fff';
  }

  const output = document.getElementById('apiConsoleOutput');
  output.textContent = `// ${reqTitle}\n// Status: ${status} | Latency: ${latency}ms\n\n` + JSON.stringify(data, null, 2);
}

// Initialize
loadStats();
loadBooksTable();
