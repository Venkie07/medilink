import { sequelize } from '../models/index.js';
import UserRepository from '../repositories/UserRepository.js';
import PatientRepository from '../repositories/PatientRepository.js';
import AppointmentRepository from '../repositories/AppointmentRepository.js';
import PrescriptionRepository from '../repositories/PrescriptionRepository.js';
import LabRepository from '../repositories/LabRepository.js';
import StorageService from './StorageService.js';
import { generatePatientId, generateQRCode } from '../utils/utils.js';
import { AppError } from '../middleware/errorHandler.js';

class PatientService {
  async registerPatient(patientData) {
    const { userId, password, name, age, gender, bloodGroup, allergies, address, mobile, email } = patientData;

    // Check if the User ID is already occupied
    const existingUser = await UserRepository.findByUserId(userId);
    if (existingUser) {
      throw new AppError('User ID already exists.', 409);
    }

    const patientId = generatePatientId();
    // Maintain temporary backward compatibility for qrCode in Phase 2
    const qrCode = await generateQRCode(patientId);

    // Enforce database transaction protection
    const transaction = await sequelize.transaction();

    try {
      const user = await UserRepository.create({
        userId,
        password,
        name,
        role: 'Patient',
        address,
        mobile,
        email
      }, { transaction });

      const patient = await PatientRepository.create({
        userId: user.id,
        patientId,
        age,
        gender,
        bloodGroup,
        allergies,
        qrCode
      }, { transaction });

      await transaction.commit();

      return {
        id: patient.id,
        patientId,
        name: user.name,
        role: user.role,
      };
    } catch (error) {
      await transaction.rollback();
      throw new AppError(`Registration failed: ${error.message}`, 500);
    }
  }

  async getAllPatients() {
    return await PatientRepository.findAll();
  }

  async getPatientProfile(patientId) {
    const patient = await PatientRepository.findByPatientId(patientId);
    if (!patient) {
      throw new AppError('Patient profile not found.', 404);
    }
    return patient;
  }

  async getPatientProfileByUserId(userId) {
    const patient = await PatientRepository.findByUserId(userId);
    if (!patient) {
      throw new AppError('Patient profile not found.', 404);
    }
    return patient;
  }

  async getPatientHistory(patientUUID) {
    const patient = await PatientRepository.findById(patientUUID);
    if (!patient) {
      throw new AppError('Patient profile not found.', 404);
    }

    // Retrieve corresponding data sets from related tables
    const [appointments, prescriptions, labTests] = await Promise.all([
      AppointmentRepository.findAll({ patientId: patientUUID }),
      PrescriptionRepository.findAll({ patientId: patientUUID }),
      LabRepository.findAllTests({ patientId: patientUUID }),
    ]);

    // Dynamically generate signed temporary URLs for completed report files
    for (const test of labTests) {
      if (test.report && test.report.filePath) {
        try {
          const signedUrl = await StorageService.getSignedUrl('lab-reports', test.report.filePath, 900);
          test.report.setDataValue('filePath', signedUrl);
        } catch (err) {
          test.report.setDataValue('filePath', test.report.filePath);
        }
      }
    }

    return {
      patient,
      appointments,
      prescriptions,
      labTests,
    };
  }
}

export default new PatientService();
