import { Patient, User } from '../models/index.js';

class PatientRepository {
  async findById(id) {
    return await Patient.findByPk(id, {
      include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }],
    });
  }

  async findByUserId(userId) {
    return await Patient.findOne({
      where: { userId },
      include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }],
    });
  }

  async findByPatientId(patientId) {
    return await Patient.findOne({
      where: { patientId },
      include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }],
    });
  }

  async findAll() {
    return await Patient.findAll({
      include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }],
    });
  }

  async create(patientData) {
    return await Patient.create(patientData);
  }
}

export default new PatientRepository();
