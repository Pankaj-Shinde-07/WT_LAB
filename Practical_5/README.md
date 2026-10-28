# HealthCare Express — Clinical Appointment Booking Portal
### Web Technology Practical No. 05: Web Application Framework with ExpressJS

> **Institution:** MIT Academy of Engineering, Alandi, Pune  
> **Student Name:** Pankaj Shinde  
> **PRN:** 202401100005  
> **Branch & Division:** Software Engineering (Division A)  
> **Framework:** ExpressJS (v5), Express Router, Custom Middleware, Persistent JSON Storage

---

## 1. Project Overview & Architecture
Practical No. 05 demonstrates **server-side validation and modular routing using the ExpressJS framework** for a healthcare clinical appointment system. The application showcases:
- **Express Middleware:** Dedicated validation middleware (`middleware/validator.js`) intercepting requests before reaching route handlers.
- **Express Routers:** Modular separation with `routes/appointmentRoutes.js` and `routes/statsRoutes.js`.
- **Status Codes:** Standardized HTTP responses (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Internal Error`).
- **Persistence:** Scheduled appointments persisted in `data/appointments.json`.

### Folder Structure
```
Practical_5/
├── package.json               # Express dependencies and start scripts
├── server.js                  # Main Express application, middleware pipeline
├── routes/
│   ├── appointmentRoutes.js   # Express router for patient bookings & status updates
│   └── statsRoutes.js         # Express router for clinic aggregate statistics
├── middleware/
│   └── validator.js           # Server-side validation middleware
├── data/
│   └── appointments.json      # Persistent JSON storage for clinical records
├── public/
│   ├── index.html             # Responsive clinic appointment booking interface
│   ├── style.css              # Clinical teal and slate CSS design system
│   └── app.js                 # Client controller with demo fillers and status updates
└── screenshots/               # Captured verification figures
```

---

## 2. Server-Side Validation Matrix

| Field | Express Middleware Validation Rule | Invalid Example | Server Error Message Returned |
| :--- | :--- | :--- | :--- |
| **Patient Name** | Trimmed length $\ge 3$ characters, letters & periods | `"P"` or `""` | *"Patient name must contain at least 3 characters."* |
| **Patient Age** | Integer between 1 and 120 | `"150"` or negative | *"Age must be between 1 and 120 years."* |
| **Gender** | Required: Male, Female, or Other | Unselected | *"Gender selection is required."* |
| **Contact Email** | Standard email format (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) | `"bad_email"` | *"Please provide a valid email address."* |
| **Mobile Number** | 10-digit Indian phone starting 6–9 (`/^[6-9]\d{9}$/`) | `"12345"` | *"Enter a valid 10-digit Indian mobile number beginning with 6-9."* |
| **Department** | Must match approved medical department | Unselected | *"Specialist medical department selection is required."* |
| **Appointment Date** | Must be today or a future date (no past dates) | Past date (`"2020-01-01"`) | *"Appointment date cannot be in the past."* |
| **Time Slot** | Non-empty clinical time slot | Unselected | *"Preferred appointment time slot is required."* |
| **Symptoms** | Detailed description with at least 10 characters | `"Pain"` | *"Please describe symptoms with at least 10 characters of detail."* |

---

## 3. Local Setup & Execution

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation & Run Steps
```bash
# Navigate to Practical_5 directory
cd "Web-Technology-main/Practical_5"

# Install dependencies (express, cors)
npm install

# Start Express server
npm start
```
The server will start at: **`http://localhost:5000`**.
Open your browser to interact with the clinical appointment portal and test one-click demo fillers.
