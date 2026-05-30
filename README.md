# 🏥 MediLink — Enterprise-Grade Cloud Healthcare Platform

<div align="center">

### 🌐 Secure, Accessible, and Stateless Healthcare Ecosystem

Built to orchestrate modern digital clinical workflows with military-grade security, secure storage streaming, automated audit trails, and multi-role administrative queues.

<br>

![React](https://img.shields.io/badge/Frontend-React%2018-blue?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20ESM-green?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/API-Express%204-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Hosting-Vercel%20Serverless-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Firebase](https://img.shields.io/badge/Hosting-Firebase%20Hosting-FFCA28?style=for-the-badge&logo=firebase&logoColor=white)
![JWT](https://img.shields.io/badge/Security-JWT%20Rotation-orange?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

</div>

---

## 📖 Table of Contents

1. [About the Project](#-about-the-project)
2. [Core Architecture & Tech Stack](#-core-architecture--tech-stack)
3. [Enterprise Security & Clinical Data Protection](#-enterprise-security--clinical-data-protection)
4. [Role-Specific Clinical Modules](#-role-specific-clinical-modules)
5. [System Directory Structure](#-system-directory-structure)
6. [Quickstart & Seeding Demo Users](#-quickstart--seeding-demo-users)
7. [Production Deployment Blueprint](#-production-deployment-blueprint)
8. [Future Vision & Real-World Implementations](#-future-vision--real-world-implementations)
9. [Developer & Support](#-developer--support)

---

## 📖 About the Project

**MediLink** is a next-generation SaaS healthcare platform engineered to bridge the clinical gap between **Doctors, Patients, Lab Technicians, Pharmacists, and Hospital Administrators** within a single, unified workspace.

The platform is designed from the ground up to solve critical inefficiencies in modern healthcare operations:
* 📑 **Eliminating Paperwork:** Providing real-time active queues for laboratory diagnostic requests and pharmaceutical prescriptions.
* 🔒 **Stateless Compliance:** Removing all local server dependencies. Files stream dynamically via memory buffers to encrypted cloud buckets, fully optimizing the app for serverless auto-scaling (e.g., Vercel / AWS Lambda).
* 🎨 **Visual Excellence:** Implementing an accessible, premium, and highly responsive **Clinical Design System** utilizing Inter and Plus Jakarta Sans typeplays, clear diagnostic visual cards, and strict accessibility-first design boundaries.

---

## 🏗️ Core Architecture & Tech Stack

MediLink adheres to a strict, scalable **Multi-Tier Service-Repository Architecture** to isolate business concerns:

```
                            [ Client Browser ]
                                    │ (HTTPS, HTTP-Only Cookies)
                                    ▼
                          [ Express Gateway ]
                                    │ (Rate Limiter, CORS Controls)
                                    ▼
                         [ Zod Validation Layer ]
                                    │
                                    ▼
                       [ thin Express Controllers ]
                                    │
                                    ▼
                          [ Coord. Services ] ◄──► [ Storage Service (Supabase) ]
                                    │
                                    ▼
                         [ ORM Repositories ] 
                                    │
                                    ▼
                      [ Production PostgreSQL ]
```

### Stack Breakdown

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend UI** | **React 18 & Vite** | High-performance SPA with fast hot module replacement. |
| **Styling Engine**| **Vanilla CSS & Tailwind** | Custom Clinical Design system matching premium SaaS interfaces. |
| **Animation Core**| **Framer Motion** | Micro-interactions, slide-out queues, and collapsible menus. |
| **Backend Framework**| **Node.js (ESM) & Express**| Thin controller endpoints with clean modular separation. |
| **Validation** | **Zod** | Enforces strict schemas for body payloads, query parameters, and IDs. |
| **ORM Layer** | **Sequelize** | PostgreSQL object-relational mapping, dynamic indexing, connection pooling. |
| **Database** | **Supabase PostgreSQL** | Fully pooled, highly available enterprise-grade relational backend. |
| **Cloud Storage** | **Supabase Storage** | Encrypted cloud bucket streaming for diagnostics and documents. |
| **Backend Deploy**| **Vercel Serverless** | Stateless node functions with auto-scaling capabilities. |
| **Frontend Deploy**| **Firebase Hosting** | Globally distributed CDN hosting with SPA optimized caching. |

---

## 🛡️ Enterprise Security & Clinical Data Protection

Healthcare data demands the highest standard of security. MediLink utilizes state-of-the-art cryptographic, authorization, and network policies:

### 1. Cryptographic Document Protection (Supabase Storage)
MediLink completely avoids exposing raw cloud urls. All buckets (e.g., `lab-reports`, `prescriptions`) are set to **Private**.
* **Temporary Signed URLs:** When an authorized user requests a document (e.g., a patient viewing a lab PDF or a doctor reviewing records), `StorageService` dynamically requests a temporary cryptographic signed URL from Supabase with a strict **15-minute expiration window**. 
* **Zero Residual Storage Exposure:** Once the 15-minute token expires, the URL is completely invalidated, protecting patients and institutions from malicious unauthorized document scraping.

### 2. Dual-Token JWT Session Rotation
MediLink utilizes a highly secure, modern authentication cycle to protect sessions against XSS (Cross-Site Scripting) and CSRF (Cross-Site Request Forgery):
* **Short-Lived Access Token:** Expiring in **15 minutes**, signed with `JWT_SECRET`, and carried strictly inside auth request headers for API verification.
* **Long-Lived Refresh Token:** Expiring in **7 days**, signed with `JWT_REFRESH_SECRET`, and stored in a **Secure, HTTP-only, SameSite=Strict Cookie** (`medilink_refresh`).
* **Refresh Token Rotation:** On every refresh cycle, the old refresh cookie is invalidated and a brand new key is rotated in, preventing session hijacking.

### 3. Automated Mutating Audit Logs
Clinical compliance requires an immutable audit trail.
* Our automated **`auditLog` middleware** interceptor registers all mutating HTTP methods (`POST`, `PUT`, `PATCH`, `DELETE`).
* It captures the **Actor ID, User Role, Resource Path, Response Status Code, Execution Time (ms), and Requesting IP Address**.
* Outputs are streamed to Winston's structured clinical log directories (`logs/error.log`, `logs/combined.log`) to provide total accountability for prescribing, diagnostic edits, and credential modifications.

### 4. Rate-Limiting & API Gateway Hardening
* **Brute-Force Shield:** Limits authentication requests (`/api/v1/auth/login`) to **20 attempts per 15 minutes** per IP.
* **System Throttling:** Restricts overall API queries to **100 calls per 15 minutes** to mitigate DDoS and rapid scraping.

### 5. Medical Document Storage Format & Compression Best Practices
To optimize cloud storage consumption and preserve strict diagnostic standards:
* **Text-Based Documents & Paperwork (e.g., Prescriptions, Lab Reports):** **PDF (.pdf)** is the absolute clinical standard. PDFs balance sharp text clarity with highly efficient vector compression, ensuring smallest storage sizes while keeping formatting perfectly preserved across device viewports.
* **Scanned Paperwork & Photos:** **JPEG (.jpg)** or compressed PDF. JPEGs strip out unnecessary color depth the human eye cannot perceive, optimizing file sizes for typical patient uploads of physically scanned paper logs.
* **Diagnostic Medical Imaging (e.g., CT, MRI, X-Rays):**
  * **For clinical diagnostic review:** **DICOM (.dcm)** is mandatory. It preserves the uncompressed 16-bit tissue/bone contrast depth and metadata. *Note: DICOMs are naturally large and are not compressed on upload.*
  * **For patient dashboard viewing & sharing:** **JPEG** or **PNG** exports. These strip DICOM depth to produce compressed, lightweight visual references that maintain absolute diagnostic clarity at fraction-sized bytes.

---

## 👨‍⚕️ Role-Specific Clinical Modules

MediLink streamlines clinical environments through tailored dashboards utilizing real-time active queues:

* **👨‍💼 Administrator Portal:** Full-scale staff onboarding controls, role assignment, database state analytics, and centralized account management.
* **👨‍⚕️ Doctor Workstation:** Seamless Patient Profile registrations, automated medical ID assignment (`MEDI-xxxx`), real-time diagnostic test ordering, electronic prescriptions, and appointment monitoring.
* **🧪 Laboratory Queue:** Direct streaming diagnostic uploads. Technicians process real-time pending requests, upload PDF or image test results straight into memory buffers, and update clinical outcome summaries.
* **💊 Pharmaceutical Terminal:** Real-time dispensing monitor. Pharmacists view active prescriptions, audit prescribing doctor details, verify medication lists (name, dosage, frequency), and mark items as "Dispensed".
* **🧑‍🦽 Accessible Patient Portal:** Direct, highly accessible view of checkup schedules, active prescriptions, digital ID cards with dynamic QR verification code, and secure, signed downloads for diagnostic records.

---

### 🤖 MediDoctor AI Clinical Assistant

MediDoctor is MediLink's intelligent AI-powered healthcare companion designed to bridge the gap between symptom discovery and professional medical consultation.

#### Core Capabilities

* **🩺 AI Symptom Assessment**

  * Patients can chat naturally with MediDoctor about symptoms, concerns, and health conditions.
  * The AI conducts structured follow-up questioning to gather relevant clinical context including duration, severity, associated symptoms, medications, allergies, and medical history.

* **💬 Persistent Conversation History**

  * Conversations are stored securely and can be resumed at any time.
  * Patients can manage multiple conversations through a ChatGPT-style interface with searchable conversation history.

* **📋 Clinical Assessment Generation**

  * MediDoctor automatically generates structured consultation summaries containing:

    * Reported Symptoms
    * Severity Assessment
    * Possible Areas of Concern
    * Medical Context Collected
    * Suggested Specialist Type
  * Summaries help streamline doctor consultations and reduce repetitive questioning.

* **👨‍⚕️ Doctor Consultation Requests**

  * Patients can escalate any MediDoctor conversation into a formal consultation request.
  * A doctor can be selected directly from the platform's registered healthcare providers.

* **🔄 AI-to-Doctor Workflow**

  * Full conversation history
  * AI assessment history
  * Consultation summary
  * Patient details

  are securely attached to the consultation request and shared with the selected doctor.

* **📅 Automated Appointment Creation**

  * Doctors can review consultation requests and either:

    * Accept
    * Reject

  * Upon acceptance, the doctor schedules the consultation date and time.

  * MediLink automatically creates and synchronizes appointments across patient and doctor dashboards.

* **🔔 Real-Time Notifications**

  * Consultation Submitted
  * Consultation Accepted
  * Consultation Rejected
  * Appointment Scheduled
  * Appointment Updates

  are delivered directly through the MediLink notification system.

* **🚨 Emergency Detection Layer**

  * MediDoctor is configured to identify potentially critical symptoms and immediately advise users to seek emergency medical attention where appropriate.
  * The system never replaces professional medical diagnosis and acts solely as a clinical decision-support assistant.

#### Consultation Lifecycle

Patient Chat
→ AI Assessment
→ Consultation Summary
→ Doctor Selection
→ Consultation Request
→ Doctor Review
→ Accept / Reject
→ Appointment Scheduling
→ Patient Notification
→ Clinical Consultation



## 📂 System Directory Structure

```bash
MediLink/
│
├── backend/
│   ├── config/             # Database connection & pooling configurations
│   ├── controllers/        # Thin HTTP request/response handlers
│   ├── middleware/         # Zod validation, JWT cookies, rate limiters, audit logs
│   ├── models/             # Standardized Sequelize schemas
│   ├── repositories/       # High-performance ORM queries
│   ├── routes/             # v1 REST API endpoint controllers
│   ├── scripts/            # Database seeder scripts (seedDemoUsers.js)
│   ├── services/           # Coordinated business logic & transactions
│   ├── utils/              # Winston logger, Supabase storage clients
│   ├── vercel.json         # Vercel serverless gateway routing
│   └── server.js           # Server bootstrapper
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Accessible sidebar, Navbar, Modal primitives
│   │   ├── context/        # Global Auth & State Contexts
│   │   ├── layouts/        # Collapsible responsive layouts
│   │   ├── pages/          # Tailored role-specific dashboards
│   │   ├── services/       # Axios instance with cookie support
│   │   ├── App.jsx         # SPA page routers
│   │   └── index.css       # Custom Clinical Design token specifications
│   │
│   ├── firebase.json       # Firebase Hosting cache rules & routing
│   └── vite.config.js      # Vite build & local proxy settings
│
└── README.md
```
---
# Database Structure 



  <a href="./database.svg">
    <img src="./database.svg" alt="Database Structure" width="100%">
  </a>


<p align="center">
  Click the diagram to zoom and navigate
</p>

<br>
<br>

<details>
<summary>

# Tables Details (click to view)

</summary>

## 1.Table `Appointments`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `date` | `date` |  |
| `time` | `time` |  |
| `status` | `enum_Appointments_status` |  Nullable |
| `reason` | `text` |  Nullable |
| `createdAt` | `timestamptz` |  |
| `updatedAt` | `timestamptz` |  |
| `patientId` | `uuid` |  Nullable |
| `doctorId` | `uuid` |  Nullable |

## 2.Table `LabReports`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `filePath` | `varchar` |  |
| `resultSummary` | `text` |  Nullable |
| `uploadDate` | `timestamptz` |  Nullable |
| `createdAt` | `timestamptz` |  |
| `updatedAt` | `timestamptz` |  |
| `labTestId` | `uuid` |  Nullable |
| `technicianId` | `uuid` |  Nullable |

## 3.Table `LabTests`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `testName` | `varchar` |  |
| `status` | `enum_LabTests_status` |  Nullable |
| `requestedDate` | `date` |  Nullable |
| `createdAt` | `timestamptz` |  |
| `updatedAt` | `timestamptz` |  |
| `patientId` | `uuid` |  Nullable |
| `doctorId` | `uuid` |  Nullable |

## 4.Table `Patients`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `patientId` | `varchar` |  Unique |
| `age` | `int4` |  |
| `gender` | `enum_Patients_gender` |  |
| `qrCode` | `text` |  Nullable |
| `createdAt` | `timestamptz` |  |
| `updatedAt` | `timestamptz` |  |
| `userId` | `uuid` |  Nullable |

## 5.Table `PrescriptionItems`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `name` | `varchar` |  |
| `dosage` | `varchar` |  |
| `frequency` | `varchar` |  |
| `createdAt` | `timestamptz` |  |
| `updatedAt` | `timestamptz` |  |
| `prescriptionId` | `uuid` |  Nullable |

## 6.Table `Prescriptions`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `instructions` | `text` |  Nullable |
| `date` | `date` |  Nullable |
| `status` | `enum_Prescriptions_status` |  Nullable |
| `createdAt` | `timestamptz` |  |
| `updatedAt` | `timestamptz` |  |
| `appointmentId` | `uuid` |  Nullable |
| `doctorId` | `uuid` |  Nullable |
| `patientId` | `uuid` |  Nullable |

## 7.Table `Users`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `userId` | `varchar` |  Unique |
| `password` | `varchar` |  |
| `name` | `varchar` |  |
| `role` | `enum_Users_role` |  |
| `email` | `varchar` |  Nullable |
| `mobile` | `varchar` |  Nullable |
| `address` | `text` |  Nullable |
| `hospitalName` | `varchar` |  Nullable |
| `certifiedId` | `varchar` |  Nullable |
| `createdAt` | `timestamptz` |  |
| `updatedAt` | `timestamptz` |  |

---

</details>


## 🚀 Quickstart & Seeding Demo Users

### 1. Install Dependencies
In two separate terminals:
```bash
# Terminal 1 - Backend
cd backend
npm install

# Terminal 2 - Frontend
cd frontend
npm install
```

### 2. Configure Local `.env`
Create `backend/.env` containing your credentials:
```env
PORT=5000
NODE_ENV=development

JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key

CORS_ORIGIN=http://localhost:3000

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_KEY=your_service_role_key
```

### 3. Seed Demo Testing Accounts
To facilitate instant testing, we have built a secure, duplicate-safe database seeder. Run:
```bash
cd backend
npm run seed:demo
```
This script connects to your Supabase database, automatically checks if users already exist, registers a patient properly using PatientService (setting up clinical identifiers, generating standard QR codes), and exports clean copy-pasteable login credentials to **`backend/credentials.txt`**:

```text
==================================================
              MEDILINK DEMO LOGIN CREDENTIALS
==================================================
ADMIN          | ID: admin_demo    | Pass: Medilink@123
DOCTOR         | ID: doctor_demo   | Pass: Medilink@123
PATIENT        | ID: patient_demo  | Pass: Medilink@123
LAB TECHNICIAN | ID: lab_demo      | Pass: Medilink@123
PHARMACY       | ID: pharmacy_demo | Pass: Medilink@123
==================================================
```

### 4. Run Development Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```
Open `http://localhost:3000` to start testing!

---

## 🌍 Production Deployment Blueprint

### Backend (Vercel)
1. Install CLI: `npm install -g vercel`
2. Authenticate: `vercel login`
3. Deploy env variables: Set `JWT_SECRET`, `JWT_REFRESH_SECRET`, `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_KEY`, and `NODE_ENV=production` inside your Vercel Project Dashboard.
4. Deploy: `cd backend && vercel --prod`

### Frontend (Firebase)
1. Install CLI: `npm install -g firebase-tools`
2. Authenticate: `firebase login`
3. Add production URL inside `frontend/.env.production`:
   `VITE_API_URL=https://your-backend.vercel.app/api`
4. Build: `cd frontend && npm run build`
5. Deploy: `firebase deploy --only hosting`

---

## 🔮 Future Vision & Real-World Implementations

MediLink is positioned to scale beyond traditional hospital information systems. Here are the core architectures scheduled for upcoming releases to evolve the platform into a world-class health ecosystem:

### 1. Federated EHR Integration (HL7 FHIR Compliance)
* **Objective:** Allow MediLink records to talk seamlessly with major hospital systems globally (Epic, Cerner, Allscripts).
* **Architecture:** Transition medical storage schema models to support the **HL7 FHIR (Fast Healthcare Interoperability Resources)** RESTful API framework. This will permit secure, standardized cross-institutional patient query exchanges.

### 2. Edge-Computed Diagnostic AI (Computer Vision Pipeline)
* **Objective:** Enable instantaneous, privacy-preserving radiological report auditing.
* **Architecture:** Wire a client-side WebAssembly (WASM) neural model directly within the **Lab Module** to run optical chest X-ray scanning or dermal lesion screening. This gives laboratory technicians automated clinical secondary audits directly in the browser *before* uploading reports to the database, maintaining latency efficiency without exposing records to third-party AI APIs.

### 3. Patient-Owned Sovereign Identity (Decentralized Identity / DID)
* **Objective:** Give patients complete ownership and control over who has access to their clinical records.
* **Architecture:** Implement decentralized identity keys (W3C DID standard). Patients can grant or revoke cryptographic decryption keys to doctors, pharmacies, or testing centers dynamically through secure mobile keyrings, moving away from centralized database credential reliance.

### 4. Real-World Smart-Pharmacy & Automated Dispensation
* **Objective:** Seamless, contactless drug delivery for chronic patients.
* **Architecture:** Wire the **Pharmacy Module** to support secure MQTT web sockets. Once a pharmacist marks a prescription as "Dispensed" in the dashboard, an API call triggers physical smart-locker gates at clinical exits to unlock automatically for patient collection via their mobile MediLink QR identity code.

---

## 👨‍💻 Developer & Support

### Venkateswaran K
* **Specialization:** B.Tech Artificial Intelligence & Data Science
* **Focus:** Full Stack Engineering | Cloud-Native Security Systems | UI/UX Accessibility Primitives

---

<div align="center">

### 💙 MediLink — Connecting Healthcare Digitally

</div>
