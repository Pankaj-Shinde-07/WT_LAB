# JobApply — Job Application Portal
### Web Technology Practical No. 3: Front-End JavaScript Frameworks (ReactJS)

> **Institution:** MIT Academy of Engineering, Alandi, Pune  
> **Student Name:** Pankaj Shinde  
> **PRN:** 202401100005  
> **Branch:** Software Engineering (Division A)  
> **GitHub Repository:** [https://github.com/Pankaj-Shinde-07/JobApply-Practical-3](https://github.com/Pankaj-Shinde-07/JobApply-Practical-3)  
> **Live Deployment:** [https://pankaj-shinde-07.github.io/JobApply-Practical-3/](https://pankaj-shinde-07.github.io/JobApply-Practical-3/)

---

## 1. Aim & Objectives
To design, develop, and deploy an individual single-page web application using **ReactJS** named **JobApply — Job Application Portal** demonstrating:
- React component architecture, `useState` and `useEffect` hooks
- Controlled inputs and event handling
- Comprehensive real-time and on-submission client-side validation
- Meaningful field-level error feedback and overall warning/success notifications
- Browser-side data persistence via `localStorage` with JSON serialization
- Dynamic filtering, search, and deletion of submitted records
- Responsive, modern user interface optimized across desktop, tablet, and mobile devices
- Automated production build and public deployment via GitHub Pages / Vercel

---

## 2. Technologies Used
| Technology | Role & Purpose |
| :--- | :--- |
| **ReactJS 19** | Component-based UI rendering, JSX syntax, declarative state handling |
| **JavaScript (ES6+)** | Form validation algorithms, array operations, regex matching |
| **Vite** | Next-generation dev server and optimized production bundler |
| **Vanilla CSS3** | Custom design tokens, glassmorphism, responsive grid & media queries |
| **localStorage & JSON** | Persistent browser-side storage (`jobApplyApplications`) |
| **Lucide Icons** | SVG iconography for enhanced visual hierarchy |
| **Canvas Confetti** | Interactive micro-animation celebrating valid submission |
| **GitHub Actions** | Automated CI/CD workflow for GitHub Pages deployment |

---

## 3. Client-Side Validation Matrix

| Field | Validation Rule | Invalid Example | Error Message |
| :--- | :--- | :--- | :--- |
| **Full Name** | Trimmed length $\ge 3$ characters, letters only | `"Ab"` or `""` | *"Name must contain at least 3 characters."* |
| **Email Address** | Standard email format with user, domain & TLD | `"pankaj@domain"` | *"Please enter a valid email address."* |
| **Mobile Number** | 10-digit Indian mobile number starting with 6–9 | `"123456"` or `"5891234567"` | *"Enter a valid 10-digit Indian mobile number beginning with 6–9."* |
| **Job Role** | Non-empty role selected from dropdown | `"Select a role"` | *"Please select a job role."* |
| **Education** | Non-empty qualification selected | `"Select education"` | *"Please select your education."* |
| **Experience** | Finite integer between 0 and 50 years | `"-1"` or `"55"` | *"Experience must be a finite number between 0 and 50 years."* |
| **Resume URL** | Optional; if provided must start with HTTP/HTTPS | `"ftp://site.com"` | *"Enter a valid HTTP or HTTPS URL."* |

---

## 4. Key Interactive Features
1. **Real-time & On-Blur Validation:** Inputs provide visual feedback immediately after user interaction (red border & alert message for invalid, green border & checkmark for valid).
2. **One-Click Demo Fillers:**
   - **`✨ Valid Demo`**: Fills standard valid student data for instant evaluation.
   - **`⚠️ Invalid Demo`**: Fills borderline invalid data to test all field error states simultaneously.
3. **Submitted Applications Activity:**
   - Color-coded role badges, avatar initials, qualification, experience, contact details, timestamp.
   - Optional external resume link.
   - Search bar: real-time search across applicant name, email, phone, and role.
   - Filter dropdown: filter by designated job role.
   - Delete action: individually delete records with update to localStorage and live counters.
4. **Interactive Modals:**
   - **Test Suite Modal (T1–T14):** Lists all 14 syllabus test cases with expected results.
   - **JSON State Modal:** Displays raw formatted JSON persisted in `localStorage`.

---

## 5. Local Setup & Execution

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation Steps
```bash
# Navigate to the Practical_3 directory
cd "Web-Technology-main/Practical_3"

# Install dependencies
npm install

# Start local Vite development server
npm run dev
```
Open your browser and navigate to `http://localhost:5173/`.

### Production Build
```bash
npm run build
```
The compiled, production-ready static assets will be output to the `dist/` folder.

---

## 6. Deployment Guide

### Option A: GitHub Pages via Automated GitHub Actions (Recommended)
1. Commit and push the project to your GitHub repository:
   ```bash
   git add .
   git commit -m "Add Practical 3: JobApply React Application"
   git push origin main
   ```
2. In your GitHub repository:
   - Navigate to **Settings > Pages**.
   - Under **Build and deployment > Source**, select **GitHub Actions**.
3. The `.github/workflows/deploy.yml` workflow will automatically trigger, build the Vite app, and publish the site to:
   `https://<your-username>.github.io/<repo-name>/`

### Option B: Instant Free Deployment via Vercel CLI
```bash
npx vercel --prod
```
Follow the interactive prompts to get an instant HTTPS deployment link (e.g., `jobapply-portal.vercel.app`).
