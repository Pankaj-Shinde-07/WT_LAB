// server.js - Practical No. 06: RESTful API for Library Management
// Developed by: Pankaj Shinde (PRN: 202401100005) - MIT Academy of Engineering

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5050;
const DB_FILE = path.join(__dirname, 'data', 'books.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Request logging middleware for Postman & client auditing
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[REST API] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Database helper functions with fallback
function ensureDB() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, '[]', 'utf-8');
}

function readBooks() {
  ensureDB();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading books.json:', err);
    return [];
  }
}

function writeBooks(books) {
  ensureDB();
  fs.writeFileSync(DB_FILE, JSON.stringify(books, null, 2), 'utf-8');
}

// ─── RESTFUL API ENDPOINTS ───────────────────────────────────────────────────

// 1. GET /api/health - Health check endpoint for hosting deployment
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Library Management RESTful API',
    student: 'Pankaj Shinde (PRN: 202401100005)',
    timestamp: new Date().toISOString()
  });
});

// 2. GET /api/stats - Aggregate library metrics
app.get('/api/stats', (req, res) => {
  const books = readBooks();
  const available = books.filter(b => b.available).length;
  const unavailable = books.length - available;

  const genreCounts = {};
  books.forEach(b => {
    genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1;
  });

  res.status(200).json({
    success: true,
    totalBooks: books.length,
    availableCopies: available,
    issuedCopies: unavailable,
    genreBreakdown: genreCounts
  });
});

// 3. GET /api/books - READ ALL (Supports search, genre, and availability filters)
app.get('/api/books', (req, res) => {
  const { search, genre, available } = req.query;
  let books = readBooks();

  if (search && search.trim() !== '') {
    const q = search.trim().toLowerCase();
    books = books.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      (b.isbn && b.isbn.toLowerCase().includes(q))
    );
  }

  if (genre && genre !== 'All') {
    books = books.filter(b => b.genre.toLowerCase() === genre.toLowerCase());
  }

  if (available !== undefined && available !== '') {
    const isAvail = available === 'true';
    books = books.filter(b => b.available === isAvail);
  }

  res.status(200).json({
    success: true,
    count: books.length,
    data: books
  });
});

// 4. GET /api/books/:id - READ SINGLE RECORD BY ID
app.get('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ success: false, error: 'Invalid book ID format. ID must be an integer.' });
  }

  const books = readBooks();
  const book = books.find(b => b.id === id);

  if (!book) {
    return res.status(404).json({
      success: false,
      error: `Book with ID ${id} not found in the library database.`
    });
  }

  res.status(200).json({
    success: true,
    data: book
  });
});

// 5. POST /api/books - CREATE A NEW RECORD (With Server-Side Validation)
app.post('/api/books', (req, res) => {
  const { title, author, genre, isbn, publicationYear, copies } = req.body;
  const errors = {};

  if (!title || typeof title !== 'string' || title.trim().length < 2) {
    errors.title = 'Book title is required and must contain at least 2 characters.';
  }
  if (!author || typeof author !== 'string' || author.trim().length < 2) {
    errors.author = 'Author name is required and must contain at least 2 characters.';
  }
  if (!genre || typeof genre !== 'string' || genre.trim().length < 2) {
    errors.genre = 'Genre category is required.';
  }

  const yearNum = parseInt(publicationYear, 10);
  if (publicationYear !== undefined && publicationYear !== '') {
    const currentYear = new Date().getFullYear();
    if (isNaN(yearNum) || yearNum < 1400 || yearNum > currentYear) {
      errors.publicationYear = `Publication year must be between 1400 and ${currentYear}.`;
    }
  }

  const copiesNum = parseInt(copies, 10);
  if (copies !== undefined && copies !== '') {
    if (isNaN(copiesNum) || copiesNum < 0) {
      errors.copies = 'Copies count must be a non-negative integer.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed for new book creation.',
      errors
    });
  }

  const books = readBooks();
  const newId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
  const totalCopies = copiesNum !== undefined && !isNaN(copiesNum) ? copiesNum : 1;

  const newBook = {
    id: newId,
    title: title.trim(),
    author: author.trim(),
    genre: genre.trim(),
    isbn: isbn && isbn.trim() ? isbn.trim() : `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    publicationYear: !isNaN(yearNum) ? yearNum : new Date().getFullYear(),
    copies: totalCopies,
    available: totalCopies > 0,
    addedAt: new Date().toISOString().split('T')[0]
  };

  books.push(newBook);
  writeBooks(books);

  console.log(`[REST API] Created book record: "${newBook.title}" (ID: ${newBook.id})`);

  res.status(201).json({
    success: true,
    message: 'Book record created successfully in library database.',
    data: newBook
  });
});

// 6. PUT /api/books/:id - UPDATE AN EXISTING RECORD
app.put('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ success: false, error: 'Invalid book ID format.' });
  }

  const books = readBooks();
  const index = books.findIndex(b => b.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: `Cannot update. Book with ID ${id} does not exist.`
    });
  }

  const { title, author, genre, isbn, publicationYear, copies, available } = req.body;

  if (title && (typeof title !== 'string' || title.trim().length < 2)) {
    return res.status(400).json({ success: false, error: 'Title must be at least 2 characters.' });
  }
  if (author && (typeof author !== 'string' || author.trim().length < 2)) {
    return res.status(400).json({ success: false, error: 'Author must be at least 2 characters.' });
  }

  // Update provided fields
  if (title !== undefined) books[index].title = title.trim();
  if (author !== undefined) books[index].author = author.trim();
  if (genre !== undefined) books[index].genre = genre.trim();
  if (isbn !== undefined) books[index].isbn = isbn.trim();
  if (publicationYear !== undefined) books[index].publicationYear = parseInt(publicationYear, 10);
  if (copies !== undefined) {
    const c = parseInt(copies, 10);
    books[index].copies = c;
    books[index].available = c > 0;
  }
  if (available !== undefined) {
    books[index].available = Boolean(available);
  }
  books[index].updatedAt = new Date().toISOString().split('T')[0];

  writeBooks(books);

  console.log(`[REST API] Updated book record ID ${id}: "${books[index].title}"`);

  res.status(200).json({
    success: true,
    message: `Book record ID ${id} updated successfully.`,
    data: books[index]
  });
});

// 7. DELETE /api/books/:id - DELETE A RECORD
app.delete('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ success: false, error: 'Invalid book ID format.' });
  }

  let books = readBooks();
  const found = books.find(b => b.id === id);

  if (!found) {
    return res.status(404).json({
      success: false,
      error: `Cannot delete. Book with ID ${id} not found.`
    });
  }

  books = books.filter(b => b.id !== id);
  writeBooks(books);

  console.log(`[REST API] Deleted book record ID ${id}: "${found.title}"`);

  res.status(200).json({
    success: true,
    message: `Book "${found.title}" (ID: ${id}) deleted successfully from database.`,
    deletedRecord: found
  });
});

// 8. 404 Handler for Unmatched Endpoints
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API endpoint ${req.method} ${req.originalUrl} does not exist.`
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  Practical 06: RESTful API Server Running!`);
  console.log(`  Local URL: http://localhost:${PORT}`);
  console.log(`  REST Endpoints: http://localhost:${PORT}/api/books`);
  console.log(`  Student: Pankaj Shinde (PRN: 202401100005)`);
  console.log(`=======================================================`);
});
