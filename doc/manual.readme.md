# 🏥 MediLink - Unified Healthcare Management System

MediLink is a full-stack Healthcare Management System with a premium white-and-light-blue gradient theme. It uses a local SQLite database and supports role-specific profiles for deep medical workflows.

---

## 🚀 Setup & Execution

### 1. Prerequisites
- **Node.js** (v16+)
- No external database server required (Uses local `medilink.sqlite`)

### 2. Installation
1. Install Backend Dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Install Frontend Dependencies:
   ```bash
   cd frontend
   npm install
   ```

### 3. Database Initialization (CRITICAL)
Before running the app, you must seed the database with test users:
```bash
cd backend
node seed.js
```
*Note: This creates the `medilink.sqlite` file and populates it with the default credentials below.*

### 4. Running the Application
1. Start Backend: `cd backend && npm run dev`
2. Start Frontend: `cd frontend && npm run dev`
3. Access: `http://localhost:3000`

---

## 🔐 Default Test Credentials

| Role | User ID | Password | Key Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin_password` | Full system access |
| **Doctor** | `dr_john` | `doctor_password` | Hosp: St. Mary's, Addr: 221B Baker St |
| **Lab Tech** | `lab_tech_1` | `lab_password` | Cert: CERT-LAB-001, Name: Abhi Singh |
| **Pharmacy** | `pharmacy_1` | `pharmacy_password` | Cert: PHARM-LICENSE-2024, Addr: Medical Sq |

---

## 🛠️ System Workflows

### 1. User Profiles
Every user (Doctor, Lab Tech, Pharmacy, Patient) now has a **My Profile** section displaying:
- **Doctors**: Hospital Name and practice address.
- **Staff**: Professional Certification IDs (like 'Abhi ID').
- **All Users**: Mobile and contact address.

### 2. Clinical Flow
- **Doctors** register patients and generate MediLink Digital Cards (with QR).
- **Doctors** request Lab Tests and write Prescriptions.
- **Lab Technicians** see pending requests and upload reports.
- **Pharmacy** views active prescriptions to dispense medicine.
- **Patients** track their entire history and download reports/IDs.

---
