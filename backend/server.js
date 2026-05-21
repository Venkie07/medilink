import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import { sequelize } from './models/index.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import patientRoutes from './routes/patient.js';
import appointmentRoutes from './routes/appointment.js';
import prescriptionRoutes from './routes/prescription.js';
import labRoutes from './routes/lab.js';

dotenv.config();

// Ensure upload directory exists
const uploadDir = 'uploads/reports';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/lab', labRoutes);

// Database Sync & Server Start
sequelize.sync().then(() => {
  console.log('Database synced successfully');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});
