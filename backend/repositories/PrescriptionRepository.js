import { Prescription, PrescriptionItem, Patient, User, sequelize } from '../models/index.js';

class PrescriptionRepository {
  async findById(id) {
    return await Prescription.findByPk(id, {
      include: [
        { model: PrescriptionItem, as: 'medications' },
        { model: Patient, as: 'patient', include: [{ model: User, as: 'user', attributes: ['name'] }] },
        { model: User, as: 'doctor', attributes: ['name'] },
      ],
    });
  }

  async findAll(where = {}) {
    return await Prescription.findAll({
      where,
      include: [
        { model: PrescriptionItem, as: 'medications' },
        { model: Patient, as: 'patient', include: [{ model: User, as: 'user', attributes: ['name'] }] },
        { model: User, as: 'doctor', attributes: ['name'] },
      ],
    });
  }

  async create(prescriptionData) {
    const { patientId, doctorId, appointmentId, medications, instructions } = prescriptionData;

    const transaction = await sequelize.transaction();

    try {
      const prescription = await Prescription.create({
        patientId,
        doctorId,
        appointmentId,
        instructions,
        status: 'Active'
      }, { transaction });

      const items = medications.map(med => ({
        prescriptionId: prescription.id,
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency
      }));

      await PrescriptionItem.bulkCreate(items, { transaction });

      await transaction.commit();

      // Return with hydrated medications array
      return await this.findById(prescription.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async update(id, updateData) {
    const prescription = await Prescription.findByPk(id);
    if (!prescription) return null;
    return await prescription.update(updateData);
  }
}

export default new PrescriptionRepository();
