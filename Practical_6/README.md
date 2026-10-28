# Library Management RESTful API — Database Records Management
### Web Technology Practical No. 06: RESTful API Development, CRUD Database Persistence & Postman Verification

> **Institution:** MIT Academy of Engineering, Alandi, Pune  
> **Student Name:** Pankaj Shinde  
> **PRN:** 202401100005  
> **Branch & Division:** Software Engineering (Division A)  
> **Course:** Web Technology Laboratory (WT Lab)  
> **Backend Framework:** Node.js (v22), ExpressJS (v5), CORS Middleware  
> **Database:** Atomic File-Backed JSON Database (`data/books.json`)  
> **API Testing:** Postman Collection (v2.1.0) & Interactive In-Browser Console  
> **Live Local Port:** `http://localhost:5050`  
> **GitHub Repository:** [WT_LAB (Branch: main)](https://github.com/Pankaj-Shinde-07/WT_LAB)  
> **Deployed API Public URL:** `https://library-rest-api-pankajshinde.onrender.com` (with fallback local `http://localhost:5050`)

---

## 1. Project Overview & Architecture

Practical No. 06 demonstrates the design, development, and testing of a complete **RESTful API for Database Records Management**. The application fulfills all laboratory instructions:
1. **RESTful Architecture:** Follows statelessness, resource-oriented URIs, and standard HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`).
2. **Full CRUD Database Operations:**
   - **Create:** `POST /api/books` inserts a new book record with auto-increment primary key ID.
   - **Read (All):** `GET /api/books` retrieves the complete catalog with sorting and filtering.
   - **Read (Single):** `GET /api/books/:id` retrieves an individual record by unique ID.
   - **Update:** `PUT /api/books/:id` modifies existing book details and updates timestamp.
   - **Delete:** `DELETE /api/books/:id` permanently removes a book from the catalog.
3. **Server-Side Validation:** Enforces strict validation rules, rejecting malformed requests with `HTTP 400 Bad Request` and structured error maps.
4. **Postman Test Suite:** Complete Postman Collection JSON export (`postman/Library_Management_REST_API.postman_collection.json`) supporting 10 automated test cases.
5. **Interactive Frontend & API Console:** A modern, responsive dashboard with live metrics, quick demo fillers, and an in-browser REST API console displaying HTTP status badges, latency, and formatted JSON output.

### Folder Structure
```
Practical_6/
├── package.json               # Express dependencies, start scripts, author metadata
├── server.js                  # Main Express REST API server, CRUD routes, validation
├── data/
│   └── books.json             # Persistent atomic JSON database
├── postman/
│   └── Library_Management_REST_API.postman_collection.json  # Importable Postman Collection (v2.1)
├── public/
│   ├── index.html             # Library Management Dashboard & REST API Console
│   ├── style.css              # Custom responsive CSS design system
│   └── app.js                 # Frontend REST controller with live API console integration
├── screenshots/               # Captured verification figures for academic report
│   ├── Figure_1_Landing_Page.png
│   ├── Figure_2_Validation_Errors.png
│   ├── Figure_3_Submission_Success.png
│   └── Figure_4_Postman_Verification.png
├── generate_doc.py            # Academic report generator (DOCX)
├── convert_pdf.ps1            # DOCX to PDF converter via Word COM
├── .gitignore                 # Node modules & temporary files exclusion
└── README.md                  # Comprehensive documentation and API manual
```

---

## 2. RESTful API Specification

| HTTP Verb | Endpoint URI | Request Body Payload | Response Status | Purpose & Behavior |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | *None* | `200 OK` | Hosting uptime probe, student metadata, server timestamp |
| `GET` | `/api/stats` | *None* | `200 OK` | Aggregate statistics: total titles, available copies, issued stock, genre tally |
| `GET` | `/api/books` | *None* | `200 OK` | Retrieves all catalog records stored in `data/books.json` |
| `GET` | `/api/books/:id` | *None* | `200 OK` / `404 Not Found` | Retrieves single record by primary key; returns 404 if record is missing |
| `POST` | `/api/books` | JSON `{ title, author, genre, isbn, publicationYear, copies }` | `201 Created` / `400 Bad Request` | Validates schema and inserts record into database |
| `PUT` | `/api/books/:id` | JSON `{ title, author, copies, available, ... }` | `200 OK` / `400 Bad Request` / `404 Not Found` | Modifies fields of specified record; updates `updatedAt` field |
| `DELETE` | `/api/books/:id` | *None* | `200 OK` / `404 Not Found` | Permanently deletes record and synchronizes database |

---

## 3. Server-Side Validation Rules

All requests sent to `POST /api/books` and `PUT /api/books/:id` are validated against strict criteria:
- **Title:** Required string; trimmed length $\ge 2$ characters.
- **Author:** Required string; trimmed length $\ge 2$ characters.
- **Genre:** Required; must belong to approved catalog disciplines (`Software Engineering`, `Computer Science`, `Algorithms`, `Self-Help`, `Web Development`).
- **ISBN:** Must adhere to standard 10-digit or 13-digit ISBN regex format (`/^(97(8|9))?\d{9}(\d|X)$/i`).
- **Publication Year:** Integer between $1450$ and $\text{Current Year} + 1$ (2027). Rejects futuristic or negative years.
- **Copies:** Non-negative integer ($\ge 0$). Zero copies automatically flags book as `Out of Stock`.

When validation fails, the server rejects the request with **`HTTP 400 Bad Request`** and a detailed error object:
```json
{
  "success": false,
  "message": "Validation failed for new book creation.",
  "errors": {
    "title": "Book title is required and must contain at least 2 characters.",
    "author": "Author name is required and must contain at least 2 characters.",
    "genre": "Genre category is required."
  }
}
```

---

## 4. How to Import and Run the Postman Collection

1. Open **Postman Desktop** or **Postman Web**.
2. Click **Import** in the top left workspace toolbar.
3. Select or drag-and-drop the collection file located at:
   ```
   Practical_6/postman/Library_Management_REST_API.postman_collection.json
   ```
4. The collection will appear as **"Library Management RESTful API - Practical 06"** containing 9 pre-configured requests:
   - `1. GET /api/health - Server Health Check`
   - `2. GET /api/stats - Aggregate Metrics`
   - `3. GET /api/books - READ ALL (Retrieve Catalog)`
   - `4. GET /api/books/:id - READ SINGLE (ID: 1)`
   - `5. POST /api/books - CREATE (Add New Book)`
   - `6. PUT /api/books/:id - UPDATE (Edit Book Copies & Status)`
   - `7. DELETE /api/books/:id - DELETE (Remove Book Record)`
   - `8. POST /api/books - VALIDATION REJECTION (Test HTTP 400)`
   - `9. GET /api/books/999 - NOT FOUND (Test HTTP 404)`
5. Run the requests sequentially or execute the collection runner to verify 100% test pass rate.

---

## 5. Local Setup & Execution

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Run
```bash
# Navigate to Practical_6 directory
cd "Practical_6"

# Install dependencies (Express 5, CORS)
npm install

# Start the RESTful API Server
npm start
# OR
node server.js
```

### Accessing the Web Interface
Open your web browser and navigate to:
```
http://localhost:5050
```

---

## 6. Verification Test Cases

| Test ID | Method & URL | Test Payload | Expected Status | Result |
| :--- | :--- | :--- | :--- | :--- |
| **T1** | `GET /api/health` | None | `200 OK` | Verified (Server online) |
| **T2** | `GET /api/stats` | None | `200 OK` | Verified (Calculated stats) |
| **T3** | `GET /api/books` | None | `200 OK` | Verified (All catalog books) |
| **T4** | `GET /api/books/1` | None | `200 OK` | Verified (Single record) |
| **T5** | `GET /api/books/999` | None | `404 Not Found` | Verified (Handled 404) |
| **T6** | `POST /api/books` | `{ "title": "", "author": "" }` | `400 Bad Request` | Verified (Validation error) |
| **T7** | `POST /api/books` | `{ "publicationYear": 2099 }` | `400 Bad Request` | Verified (Future year rejected) |
| **T8** | `POST /api/books` | Valid new book JSON payload | `201 Created` | Verified (Record persisted) |
| **T9** | `PUT /api/books/1` | `{ "copies": 12, "available": true }` | `200 OK` | Verified (Record updated) |
| **T10** | `DELETE /api/books/5` | None | `200 OK` | Verified (Record deleted) |

---

## 7. Deliverables Generated

1. **Word Practical Report:** [`d:/TY subjects/WT Lab/Practical 6-202401100005.docx`](file:///d:/TY%20subjects/WT%20Lab/Practical%206-202401100005.docx)
2. **PDF Practical Report:** [`d:/TY subjects/WT Lab/Practical 6-202401100005.pdf`](file:///d:/TY%20subjects/WT%20Lab/Practical%206-202401100005.pdf)
3. **Source Code Archive:** [`d:/TY subjects/WT Lab/Practical 6-202401100005.zip`](file:///d:/TY%20subjects/WT%20Lab/Practical%206-202401100005.zip)
4. **Git Repository:** [https://github.com/Pankaj-Shinde-07/WT_LAB.git](https://github.com/Pankaj-Shinde-07/WT_LAB.git)
