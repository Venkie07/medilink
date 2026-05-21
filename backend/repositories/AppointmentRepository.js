import { Appointment, Patient, User } from '../models/index.js';

class AppointmentRepository {
  async findById(id) {
    return await Appointment.findByPk(id);
  }

  async findAll(where = {}) {
    return await Appointment.findAll({
      where,
      include: [
        { model: Patient, as: 'patient', include: [{ model: User, as: 'user', attributes: ['name'] }] },
        { model: User, as: 'doctor', attributes: ['name'] },
      ],
    });
  }

  async create(appointmentData) {
    return await Appointment.create(appointmentData);
  }

  async update(id, updateData) {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) return null;
    return await appointment.update(updateData);
  }

  async delete(id) {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) return false;
    await appointment.destroy();
    return true;
  }
}

export default new AppointmentRepository();
