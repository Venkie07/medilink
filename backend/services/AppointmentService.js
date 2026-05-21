import AppointmentRepository from '../repositories/AppointmentRepository.js';
import PatientRepository from '../repositories/PatientRepository.js';
import UserRepository from '../repositories/UserRepository.js';
import { AppError } from '../middleware/errorHandler.js';

class AppointmentService {
  async createAppointment(appointmentData, doctorId) {
    const { patientId, date, time, reason } = appointmentData;

    // Verify patient profile existence
    const patientExists = await PatientRepository.findById(patientId);
    if (!patientExists) {
      throw new AppError('Invalid patient profile ID.', 404);
    }

    return await AppointmentRepository.create({
      patientId,
      doctorId,
      date,
      time,
      reason,
    });
  }

  async getAppointmentsForRole(userId, role) {
    const where = {};
    if (role === 'Doctor') where.doctorId = userId;
    if (role === 'Patient') {
      const patient = await PatientRepository.findByUserId(userId);
      if (!patient) {
        throw new AppError('Patient profile not registered.', 404);
      }
      where.patientId = patient.id;
    }

    return await AppointmentRepository.findAll(where);
  }

  async updateAppointmentStatus(id, status, userId, role) {
    const appointment = await AppointmentRepository.findById(id);
    if (!appointment) {
      throw new AppError('Appointment record not found.', 404);
    }

    // Role-based auth verification
    if (appointment.doctorId !== userId && role !== 'Admin') {
      throw new AppError('Access denied: Unauthorized status modification.', 403);
    }

    return await AppointmentRepository.update(id, { status });
  }

  async deleteAppointment(id, userId, role) {
    const appointment = await AppointmentRepository.findById(id);
    if (!appointment) {
      throw new AppError('Appointment record not found.', 404);
    }

    // Check if the deleting entity is the assigned doctor or a system Admin
    if (appointment.doctorId !== userId && role !== 'Admin') {
      throw new AppError('Access denied: Unauthorized to cancel this appointment.', 403);
    }

    return await AppointmentRepository.delete(id);
  }
}

export default new AppointmentService();
