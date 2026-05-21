import PrescriptionRepository from '../repositories/PrescriptionRepository.js';
import PatientRepository from '../repositories/PatientRepository.js';
import { AppError } from '../middleware/errorHandler.js';

class PrescriptionService {
  async createPrescription(prescriptionData, doctorId) {
    const { patientId, medications, instructions } = prescriptionData;

    // Validate that the target patient profile exists
    const patientExists = await PatientRepository.findById(patientId);
    if (!patientExists) {
      throw new AppError('Invalid patient profile ID.', 404);
    }

    return await PrescriptionRepository.create({
      patientId,
      doctorId,
      medications,
      instructions,
    });
  }

  async getPrescriptionsForRole(userId, role) {
    const where = {};
    if (role === 'Doctor') where.doctorId = userId;
    if (role === 'Patient') {
      const patient = await PatientRepository.findByUserId(userId);
      if (!patient) {
        throw new AppError('Patient profile not found.', 404);
      }
      where.patientId = patient.id;
    }

    return await PrescriptionRepository.findAll(where);
  }

  async dispensePrescription(id, role) {
    if (role !== 'Pharmacy') {
      throw new AppError('Access denied: Only pharmacy staff can dispense medication.', 403);
    }

    const prescription = await PrescriptionRepository.findById(id);
    if (!prescription) {
      throw new AppError('Prescription record not found.', 404);
    }

    return await PrescriptionRepository.update(id, { status: 'Dispensed' });
  }
}

export default new PrescriptionService();
