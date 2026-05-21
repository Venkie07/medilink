import { Appointment, Patient, User } from '../models/index.js';

export const createAppointment = async (req, res) => {
  const { patientId, doctorId, date, time, reason } = req.body;

  try {
    const appointment = await Appointment.create({
      patientId,
      doctorId: req.user.id,
      date,
      time,
      reason
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const where = {};
    if (req.user.role === 'Doctor') where.doctorId = req.user.id;
    if (req.user.role === 'Patient') {
        const patient = await Patient.findOne({ where: { userId: req.user.id } });
        where.patientId = patient.id;
    }

    const appointments = await Appointment.findAll({
      where,
      include: [
          { model: Patient, as: 'patient', include: [{ model: User, as: 'user', attributes: ['name'] }] },
          { model: User, as: 'doctor', attributes: ['name'] }
      ]
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
export const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
export const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Optional: Check if the doctor is the one who created it
    if (appointment.doctorId !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    await appointment.destroy();
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
