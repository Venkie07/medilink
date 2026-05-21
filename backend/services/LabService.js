import { sequelize } from '../models/index.js';
import LabRepository from '../repositories/LabRepository.js';
import PatientRepository from '../repositories/PatientRepository.js';
import StorageService from './StorageService.js';
import { AppError } from '../middleware/errorHandler.js';

class LabService {
  async requestLabTest(labRequestData, doctorId) {
    const { patientId, testName } = labRequestData;

    // Validate that the target patient profile exists
    const patientExists = await PatientRepository.findById(patientId);
    if (!patientExists) {
      throw new AppError('Invalid patient profile ID.', 404);
    }

    return await LabRepository.createLabRequest({
      patientId,
      doctorId,
      testName,
    });
  }

  async getLabTestsForRole(userId, role) {
    const where = {};
    if (role === 'Doctor') where.doctorId = userId;
    if (role === 'Patient') {
      const patient = await PatientRepository.findByUserId(userId);
      if (!patient) {
        throw new AppError('Patient profile not found.', 404);
      }
      where.patientId = patient.id;
    }

    const labTests = await LabRepository.findAllTests(where);

    // Dynamically generate signed temporary URLs for completed report files
    for (const test of labTests) {
      if (test.report && test.report.filePath) {
        try {
          const signedUrl = await StorageService.getSignedUrl('lab-reports', test.report.filePath, 900);
          test.report.setDataValue('filePath', signedUrl);
        } catch (err) {
          // Log and keep mock local path or error state if generation fails
          test.report.setDataValue('filePath', test.report.filePath);
        }
      }
    }

    return labTests;
  }

  async uploadLabReport(reportData, file, technicianId) {
    const { labTestId, resultSummary } = reportData;

    // Verify test request exists
    const test = await LabRepository.findTestById(labTestId);
    if (!test) {
      throw new AppError('Laboratory request not found.', 404);
    }

    if (!file) {
      throw new AppError('No report file attachment uploaded.', 400);
    }

    // Stream file buffer directly to Supabase storage private bucket
    const destinationPath = `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
    const filePath = await StorageService.uploadFile('lab-reports', file, destinationPath);

    // Run within transactional isolation
    const transaction = await sequelize.transaction();

    try {
      const report = await LabRepository.createLabReport({
        labTestId,
        filePath,
        resultSummary,
        uploadDate: new Date(),
        technicianId,
      }, { transaction });

      await LabRepository.updateLabTest(labTestId, { status: 'Completed' }, { transaction });

      await transaction.commit();
      return report;
    } catch (error) {
      await transaction.rollback();
      // Cleanup uploaded cloud file if DB write fails
      await StorageService.deleteFile('lab-reports', filePath);
      throw new AppError(`Report upload failed: ${error.message}`, 500);
    }
  }
}

export default new LabService();
