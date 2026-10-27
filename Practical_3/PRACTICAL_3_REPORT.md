# MIT ACADEMY OF ENGINEERING, ALANDI, PUNE
## DEPARTMENT OF SOFTWARE ENGINEERING
### WEB TECHNOLOGY LABORATORY (WT LAB)
### PRACTICAL NO. 3: FRONT-END JAVASCRIPT FRAMEWORKS: REACTJS

---

**Project Title:** JOBAPPLY — JOB APPLICATION PORTAL  
**Student Name:** Pankaj Shinde  
**PRN:** 202401100005  
**Branch:** Software Engineering  
**Division:** A  
**GitHub Repository:** [https://github.com/Pankaj-Shinde-07/JobApply-Practical-3](https://github.com/Pankaj-Shinde-07/JobApply-Practical-3)  
**Deployment Link:** [https://pankaj-shinde-07.github.io/JobApply-Practical-3/](https://pankaj-shinde-07.github.io/JobApply-Practical-3/)

---

## 1. AIM
To design, develop and deploy a ReactJS single-page web application named **JobApply — Job Application Portal**, demonstrating React components, state management using hooks, event handling, real-time client-side form validation, error and success messages, interactive record management, and browser-side data persistence via `localStorage`.

---

## 2. PROBLEM STATEMENT
The practical requires developing an individual front-end web application using ReactJS. The application must demonstrate client-side validation and interactive functionality, use React concepts such as components, state and event handling, display proper error messages for invalid inputs, provide suitable success or confirmation feedback, offer a responsive user-friendly interface, and be tested with valid and invalid inputs before deploying to a public host.

**JobApply** addresses these requirements through an interactive career application portal. A candidate can enter personal and qualification details, receive immediate field-level validation feedback, review submission errors, and submit valid records. Submitted applications are displayed dynamically in an activity list, can be searched and filtered by role, can be deleted individually, and are persisted in browser `localStorage` across page reloads.

---

## 3. OBJECTIVES
1. Develop an individual ReactJS web application following component-based architecture.
2. Implement controlled inputs and event handlers for responsive user interaction.
3. Manage application state (form values, validation errors, notifications, record collections) using React `useState`.
4. Validate applicant name, email format, 10-digit Indian mobile number, job role, education, experience, and optional resume URL.
5. Provide distinct visual feedback: field-level red highlights/error text, global warning banners, and green success confirmation.
6. Persist application records across browser sessions using `localStorage` and JSON conversion.
7. Implement interactive features including dynamic record deletion, search filtering, and raw JSON state inspection.
8. Build, optimize, and deploy the application using Vite and GitHub Pages.

---

## 4. TECHNOLOGIES USED

| Technology | Purpose |
| :--- | :--- |
| **ReactJS 19** | Component-based interface and declarative virtual DOM rendering |
| **JavaScript (ES6+)** | Client-side validation logic, event handlers, regex pattern matching, array methods |
| **useState** | State hook managing form fields, validation errors, modal status, and records |
| **useEffect** | Side-effect hook synchronizing application records with browser `localStorage` |
| **HTML5 / JSX** | Semantic page layout and component structures |
| **Vanilla CSS3** | Custom design system, responsive grid layouts, animations, and color tokens |
| **Vite** | Fast local development server and production static asset bundler |
| **localStorage & JSON** | Browser-side persistent storage under key `'jobApplyApplications'` |
| **Lucide Icons** | Crisp SVG iconography for visual cues and input feedback |
| **Canvas Confetti** | Dynamic celebratory micro-animation upon valid submission |
| **GitHub Actions / Pages** | Continuous integration build and automated static website deployment |

---

## 5. CLIENT-SIDE VALIDATION MATRIX

| Field | Validation Rule | Invalid Test Case | Error Message Displayed |
| :--- | :--- | :--- | :--- |
| **Full Name** | Trimmed length $\ge 3$ characters, letters only | `"Ab"` or blank | *"Name must contain at least 3 characters."* |
| **Email Address** | Standard email pattern `user@domain.tld` | `"pankaj@domain"` | *"Please enter a valid email address (e.g. you@example.com)."* |
| **Mobile Number** | 10-digit Indian mobile format starting with 6–9 (`/^[6-9]\d{9}$/`) | `"12345"` or `"5891234567"` | *"Enter a valid 10-digit Indian mobile number beginning with 6–9."* |
| **Job Role** | A job role must be selected from dropdown | Unselected (`""`) | *"Please select a job role."* |
| **Education** | An education qualification must be selected | Unselected (`""`) | *"Please select your education."* |
| **Experience** | Finite integer between 0 and 50 years | `"-1"` or `"65"` | *"Experience must be a finite number between 0 and 50 years."* |
| **Resume URL** | Optional; if entered must match HTTP/HTTPS protocol | `"ftp://resume.pdf"` | *"Enter a valid HTTP or HTTPS URL (e.g. https://example.com/resume)."* |

---

## 6. REACTJS IMPLEMENTATION DETAILS

### 6.1 State Management (`useState`)
React `useState` manages all interactive dynamic data without manual DOM manipulations:
```jsx
const [formData, setFormData] = useState(initialFormData);
const [errors, setErrors] = useState({});
const [touched, setTouched] = useState({});
const [applications, setApplications] = useState(() => {
  return JSON.parse(localStorage.getItem('jobApplyApplications') || '[]');
});
```

### 6.2 Controlled Inputs & Real-Time Validation
Every form control reflects state through its `value` and propagates changes via `onChange` and `onBlur`:
```jsx
<input
  id="email"
  name="email"
  type="email"
  value={formData.email}
  onChange={handleChange}
  onBlur={handleBlur}
  className={errors.email ? 'input-error' : touched.email ? 'input-valid' : ''}
/>
```

### 6.3 LocalStorage Persistence (`useEffect`)
```jsx
useEffect(() => {
  localStorage.setItem('jobApplyApplications', JSON.stringify(applications));
}, [applications]);
```

---

## 7. TESTING AND VALIDATION (T1 – T14)

| Test ID | Input / Action | Expected Result | Observed Result |
| :--- | :--- | :--- | :--- |
| **T1** | Submit all fields empty | Required-field messages appear on all fields; submission rejected | **PASS** — Verified in Screenshot Fig 2 |
| **T2** | Enter short name (`"Ab"`) | *"Name must contain at least 3 characters."* appears | **PASS** — Verified |
| **T3** | Enter invalid email (`"pankaj@domain"`) | Email pattern error message displayed | **PASS** — Verified |
| **T4** | Enter invalid mobile (`"123456"`) | Mobile regex error displayed (starts 6–9, 10 digits) | **PASS** — Verified |
| **T5** | Leave role or education unselected | Dropdown selection error messages displayed | **PASS** — Verified |
| **T6** | Enter experience `< 0` or `> 50` | Range error message displayed | **PASS** — Verified |
| **T7** | Enter valid details and submit | Record added to list, confetti animation, success banner | **PASS** — Verified in Screenshot Fig 3 |
| **T8** | Leave resume URL blank | Form submits successfully as resume URL is optional | **PASS** — Verified |
| **T9** | Enter invalid resume URL | URL protocol error message displayed | **PASS** — Verified |
| **T10** | Refresh browser page | All submitted records remain intact via localStorage | **PASS** — Verified |
| **T11** | Delete an application card | Card removed from UI, count updates, storage updated | **PASS** — Verified |
| **T12** | Click "Clear form" button | All inputs and validation states reset immediately | **PASS** — Verified |
| **T13** | Click "Clear all" button | All records removed; interactive empty state displayed | **PASS** — Verified |
| **T14** | Responsive view on mobile (375px) | Layout stacks into a single column with full usability | **PASS** — Verified |

---

## 8. CONCLUSION
The **JobApply** web application successfully demonstrates the development of an individual, responsive ReactJS front-end application meeting all requirements of Practical No. 3. Form validation, controlled inputs, error messaging, local persistence, and interactive management were implemented cleanly without external backend dependencies.
