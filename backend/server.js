import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import rateLimit from 'express-rate-limit';
import { sequelize } from './models/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { auditLog } from './middleware/auditLog.js';
import logger from './utils/logger.js';

// Route imports
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import patientRoutes from './routes/patient.js';
import appointmentRoutes from './routes/appointment.js';
import prescriptionRoutes from './routes/prescription.js';
import labRoutes from './routes/lab.js';
import mediDoctorRoutes from './routes/mediDoctor.js';
import consultationRoutes from './routes/consultations.js';

dotenv.config();

// Ensure logs directory exists (local development only)
if (process.env.NODE_ENV !== 'production') {
    const logsDir = 'logs';
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }
}

const app = express();
const PORT = process.env.PORT || 5000;

// Trust Vercel/reverse proxy X-Forwarded-For headers
// Required for express-rate-limit to correctly identify client IPs in production
app.set('trust proxy', 1);

// ---------------------
// Global Middleware
// ---------------------

// CORS — restrict origins in production
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting — prevent brute-force and abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api/', apiLimiter);

// Stricter rate limit on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many login attempts, please try again later.' },
});

// HTTP request logger
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.originalUrl} - ${req.ip}`);
  next();
});

// Audit trail logger for mutating operations
app.use(auditLog);

// ---------------------
// API Routes (v1)
// ---------------------
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/prescriptions', prescriptionRoutes);
app.use('/api/v1/lab', labRoutes);
app.use('/api/v1/medidoctor', mediDoctorRoutes);
app.use('/api/v1/consultations', consultationRoutes);

// Backward compatibility — keep old /api/ paths working during migration
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/medidoctor', mediDoctorRoutes);
app.use('/api/consultations', consultationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---------------------
// Centralized Error Handler (must be LAST middleware)
// ---------------------
app.use(errorHandler);

// ---------------------
// Database Sync & Server Start
// ---------------------
sequelize.sync().then(() => {
  logger.info('Database synced successfully');
  app.listen(PORT, () => {
    logger.info(`MediLink server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}).catch(err => {
  logger.error(`Failed to sync database: ${err.message}`);
});

export default app;
