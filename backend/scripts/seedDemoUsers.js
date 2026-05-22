import { User, sequelize } from '../models/index.js';
import PatientService from '../services/PatientService.js';
import UserRepository from '../repositories/UserRepository.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedDemoUsers = async () => {
  console.log('--- Starting MediLink Demo Users Seeder ---');
  try {
    // Ensure database connection is active
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // 1. Define staff users to seed
    const staffUsers = [
      {
        userId: 'admin_demo',
        password: 'Medilink@123',
        name: 'Demo Administrator',
        role: 'Admin',
        email: 'admin_demo@medilink.com',
        mobile: '1234567890',
        address: '100 Admin HQ Blvd, Clinical Suite A',
      },
      {
        userId: 'doctor_demo',
        password: 'Medilink@123',
        name: 'Dr. Elizabeth Demo',
        role: 'Doctor',
        email: 'doctor_demo@medilink.com',
        mobile: '2234567890',
        address: 'Clinical Care Wing, Room 302',
        hospitalName: 'MediLink General Hospital',
      },
      {
        userId: 'lab_demo',
        password: 'Medilink@123',
        name: 'Demo Lab Technician',
        role: 'Lab Technician',
        email: 'lab_demo@medilink.com',
        mobile: '3234567890',
        address: 'Central Diagnostic Laboratory, Wing B',
        certifiedId: 'CERT-LAB-DEMO',
      },
      {
        userId: 'pharmacy_demo',
        password: 'Medilink@123',
        name: 'Demo Pharmacy Terminal',
        role: 'Pharmacy',
        email: 'pharmacy_demo@medilink.com',
        mobile: '4234567890',
        address: 'Main Entrance Pharmacy Dispensation Center',
        certifiedId: 'PHARM-LICENSE-DEMO',
      }
    ];

    // Seed Staff Users
    for (const staff of staffUsers) {
      const existingUser = await UserRepository.findByUserId(staff.userId);
      if (existingUser) {
        console.log(`Staff user with ID "${staff.userId}" already exists. Skipping.`);
      } else {
        await User.create(staff);
        console.log(`Created Staff User: ${staff.userId} (${staff.role})`);
      }
    }

    // 2. Define Patient User to seed
    const patientData = {
      userId: 'patient_demo',
      password: 'Medilink@123',
      name: 'Jane Demo Patient',
      age: 28,
      gender: 'Female',
      bloodGroup: 'O+',
      allergies: 'Penicillin, pollen',
      address: '742 Evergreen Terrace, Springfield',
      mobile: '5234567890',
      email: 'patient_demo@medilink.com',
    };

    const existingPatientUser = await UserRepository.findByUserId(patientData.userId);
    if (existingPatientUser) {
      console.log(`Patient user with ID "${patientData.userId}" already exists. Skipping profile/QR creation.`);
    } else {
      // Register Patient properly through PatientService to trigger business logic (QR generation, linked Patient record)
      const patientResult = await PatientService.registerPatient(patientData);
      console.log(`Created Patient User via PatientService: ${patientData.userId} (Patient ID: ${patientResult.patientId})`);
    }

    // 3. Write credentials.txt file
    const credentialsContent = `==================================================
              MEDILINK DEMO LOGIN CREDENTIALS
==================================================

ADMIN
User ID: admin_demo
Password: Medilink@123

DOCTOR
User ID: doctor_demo
Password: Medilink@123

PATIENT
User ID: patient_demo
Password: Medilink@123

LAB TECHNICIAN
User ID: lab_demo
Password: Medilink@123

PHARMACY
User ID: pharmacy_demo
Password: Medilink@123

==================================================
`;

    const credentialsPath = path.join(__dirname, '..', 'credentials.txt');
    fs.writeFileSync(credentialsPath, credentialsContent, 'utf8');
    console.log(`Credentials saved successfully to: ${credentialsPath}`);
    
    console.log('--- Seeding Completed Safely ---');
    process.exit(0);
  } catch (error) {
    console.error('Seeding process failed with error:', error);
    process.exit(1);
  }
};

seedDemoUsers();
