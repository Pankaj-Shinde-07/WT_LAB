// modules/storage.js - Pure Node.js File System Persistence Helper

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'students.json');

function ensureDataFile() {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
  }
}

function getAllStudents() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading students.json:', err);
    return [];
  }
}

function saveStudent(student) {
  ensureDataFile();
  const students = getAllStudents();
  students.unshift(student);
  fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2), 'utf-8');
  return student;
}

function deleteStudent(id) {
  ensureDataFile();
  let students = getAllStudents();
  const initialLen = students.length;
  students = students.filter(s => String(s.id) !== String(id));
  if (students.length !== initialLen) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2), 'utf-8');
    return true;
  }
  return false;
}

module.exports = {
  getAllStudents,
  saveStudent,
  deleteStudent
};
