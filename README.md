# 🏥 MediLink — Smart Healthcare Management Platform

<div align="center">

### 🌐 A Modern Full-Stack Healthcare Ecosystem

Built to streamline digital healthcare workflows with role-based management, centralized patient records, appointments, prescriptions, lab systems, and pharmacy integration.

<br>

![React](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge\&logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge\&logo=node.js)
![Express](https://img.shields.io/badge/API-Express-black?style=for-the-badge\&logo=express)
![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge\&logo=sqlite)
![TailwindCSS](https://img.shields.io/badge/UI-TailwindCSS-38BDF8?style=for-the-badge\&logo=tailwindcss)
![JWT](https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge)
![Sequelize](https://img.shields.io/badge/ORM-Sequelize-blue?style=for-the-badge\&logo=sequelize)

</div>

---

# 📖 About The Project

**MediLink** is a modern healthcare management platform designed to digitally connect **Doctors, Patients, Lab Technicians, Pharmacists, and Administrators** within a unified ecosystem.

The project focuses on creating a **centralized, secure, scalable, and visually modern healthcare workflow system** that simplifies medical record handling, appointment scheduling, prescription management, lab reporting, and patient monitoring.

Built with a clean architecture and premium glassmorphism-inspired UI, MediLink aims to bridge the gap between healthcare professionals and patients through an intuitive digital experience.

---

# ✨ Core Features

## 🔐 Authentication & Security

* Secure JWT-based authentication
* Role-based access control
* Password encryption using Bcrypt
* Protected routes and dashboards
* Session persistence

---

## 👨‍⚕️ Doctor Module

* Register new patients
* Schedule appointments
* Mark patient attendance
* Create digital prescriptions
* Request laboratory tests
* View patient medical history
* Access uploaded reports

---

## 🧑‍💼 Admin Module

* Full user management system
* Create/Edit/Delete users
* Manage doctors, labs, pharmacists, and patients
* System analytics overview
* Centralized control panel

---

## 🧪 Laboratory Module

* View pending lab requests
* Upload PDF/Image reports
* Attach summaries and test results
* Update test completion status

---

## 💊 Pharmacy Module

* Retrieve prescriptions
* Search patient medication records
* Mark medicines as dispensed
* Track prescription fulfillment

---

## 🧑‍🦽 Patient Module

* View complete medical history
* Access appointments and prescriptions
* Download lab reports
* View upcoming checkups
* Digital MediLink identity card

---

# 🎨 UI/UX Philosophy

MediLink follows a **modern healthcare dashboard design language** inspired by premium SaaS platforms and Apple-like minimal aesthetics.

### Design Highlights

* ✨ Glassmorphism UI
* 🌈 Smooth hover interactions
* 📱 Responsive layouts
* 🎯 Consistent color-coded status system
* 🔔 Real-time toast notifications
* 🧊 Soft shadows & blur effects
* 🧭 Dynamic sidebar navigation
* ⚡ Clean typography with modern spacing

---

# 🏗️ Tech Stack

# Frontend

| Technology       | Purpose                  |
| ---------------- | ------------------------ |
| React.js         | User Interface           |
| Vite             | Development & Build Tool |
| Tailwind CSS     | Styling                  |
| React Router DOM | Routing                  |
| Axios            | API Communication        |
| Context API      | Global State Management  |
| Lucide React     | Icons                    |
| React Hot Toast  | Notifications            |

---

# Backend

| Technology    | Purpose             |
| ------------- | ------------------- |
| Node.js       | Runtime Environment |
| Express.js    | REST API            |
| Sequelize ORM | Database ORM        |
| SQLite        | Database            |
| JWT           | Authentication      |
| Bcrypt        | Password Security   |

---

# 📂 Project Structure

```bash
MediLink/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   ├── server.js
│   └── medilink.sqlite
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── public/
│
└── README.md
```

---

# 🔄 System Workflow

## 1️⃣ Authentication

Users log in through a unified authentication system and are redirected based on their role.

## 2️⃣ Patient Registration

Doctors register patients into the MediLink ecosystem.

## 3️⃣ Appointment Scheduling

Appointments are created and managed digitally.

## 4️⃣ Clinical Workflow

Doctors:

* Mark attendance
* Create prescriptions
* Request lab tests

## 5️⃣ Fulfillment Workflow

* Pharmacists dispense medicines
* Lab technicians upload reports

## 6️⃣ Patient Review

Patients can:

* View reports
* Download prescriptions
* Monitor appointments

---

# 🚀 Installation Guide

# 1️⃣ Clone Repository

```bash []
git clone https://github.com/venkie07/medilink.git
cd medilink
```

---

# 2️⃣ Backend Setup

```bash
cd backend
npm install
```

### Start Backend

```bash
npm run dev
```

Server runs on:

```bash
http://localhost:5000
```

---

# 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

### Start Frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend folder:

```env
JWT_SECRET=your_secret_key
PORT=5000
```

---

# 🗄️ Database

Currently the project uses:

```text
SQLite
```

Database file:

```text
backend/medilink.sqlite
```

Future migration planned:

* PostgreSQL
* Cloud storage integration
* Production-grade deployment

---

# 📸 Screenshots

> Add your dashboard screenshots here later.

Suggested screenshots:

* Login Page
* Admin Dashboard
* Doctor Dashboard
* Patient Portal
* Lab Upload System
* Pharmacy Panel

---

# 🌟 Future Improvements

* ☁️ Cloud Deployment
* 🐘 PostgreSQL Migration
* 📊 Analytics Dashboard
* 🤖 AI Health Assistant
* 📧 Email Notifications
* 📱 Mobile Optimization
* 🔔 Real-Time Notifications
* 🧾 PDF Report Generation
* 📷 QR-Based Verification
* 🌐 Custom Domain Hosting

---

# 🛡️ Security Features

* JWT Authentication
* Password Hashing
* Protected APIs
* Role Authorization
* Secure File Handling
* Validation Middleware

---

# 📈 Project Goals

MediLink aims to become:

* A scalable healthcare ecosystem
* A centralized patient management system
* A production-ready SaaS healthcare solution
* A modern digital medical workflow platform

---

# 🤝 Contributing

Contributions, suggestions, and improvements are always welcome.

Feel free to:

* Fork the repository
* Create feature branches
* Submit pull requests
* Report issues

---

# 👨‍💻 Developer

### Venkateswaran K

🎓 B.Tech Artificial Intelligence & Data Science
💡 Full Stack Developer | AI Enthusiast | UI/UX Explorer

---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!

---

<div align="center">

### 💙 MediLink — Connecting Healthcare Digitally

</div>
