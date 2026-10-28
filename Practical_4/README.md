# NodeRegister — Student & Course Enrollment Portal
### Web Technology Practical No. 04: Server-Side Development with Pure NodeJS

> **Institution:** MIT Academy of Engineering, Alandi, Pune  
> **Student Name:** Pankaj Shinde  
> **PRN:** 202401100005  
> **Branch & Division:** Software Engineering (Division A)  
> **Server Stack:** Pure NodeJS (`http`, `url`, `fs`, `path`, `querystring` core modules — zero third-party framework dependencies)

---

## 1. Project Overview & Architecture
Practical No. 04 demonstrates robust **server-side validation using pure Node.js** for an academic student enrollment system. The application handles chunked binary stream request data, modular routing, persistent storage in `data/students.json`, and standardized HTTP response codes:
- **`200 OK`**: Successfully returned resources or status.
- **`201 Created`**: Valid student enrollment record persisted.
- **`400 Bad Request`**: Malformed or invalid input rejected by server-side validator.
- **`404 Not Found`**: Unmatched routes.

### Modular Architecture
```
Practical_4/
├── package.json         # Node.js project specification (No external dependencies)
├── server.js            # Pure Node.js HTTP server (http.createServer, stream reader)
├── modules/
│   ├── validator.js     # Pure Node.js validation functions (PRN, email, mobile, CGPA)
│   └── storage.js       # Atomic file I/O for data/students.json
├── data/
│   └── students.json    # Persistent JSON storage for student records
├── public/
│   ├── index.html       # Student enrollment interface
│   ├── style.css        # Responsive CSS styling
│   └── app.js           # Client controller with demo one-click fillers
└── screenshots/         # Captured testing & verification figures
```

---

## 2. Server-Side Validation Rules

| Input Field | Validation Rule | Invalid Example | Server Error Message Returned |
| :--- | :--- | :--- | :--- |
| **Student Name** | Trimmed length $\ge 3$ characters, alphabetic & dots | `"Al"` or `""` | *"Full name must contain at least 3 characters."* |
| **PRN Number** | Exactly 12 numeric digits (`/^\d{12}$/`) | `"12345"` | *"PRN must consist of exactly 12 numeric digits."* |
| **Email Address** | Standard email format (`user@domain.tld`) | `"invalid-email"` | *"Please provide a valid email format."* |
| **Mobile Number** | 10-digit Indian mobile starting with 6–9 | `"123456"` | *"Enter a valid 10-digit Indian mobile number beginning with 6–9."* |
| **Department** | Must match allowed academic department | Unselected | *"Academic department selection is required."* |
| **Elective Course** | Must match approved course offering list | Unselected | *"Elective course selection is required."* |
| **CGPA** | Valid floating-point number between 0.00 and 10.00 | `"15.5"` | *"CGPA must be a valid numeric score between 0.00 and 10.00."* |

---

## 3. Local Setup & Execution

### Prerequisites
- Node.js (v18 or higher)

### Run Command
```bash
# Navigate to the Practical_4 directory
cd "Web-Technology-main/Practical_4"

# Start the pure Node.js server
node server.js
```
The server will start at: **`http://localhost:4000`**.
Open your browser to interact with the enrollment portal and test one-click valid and invalid demos.
