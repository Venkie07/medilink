import { Prescription, Appointment, Patient, User } from '../models/index.js';

export const createPrescription = async (req, res) => {
  const { appointmentId, patientId, medications, instructions } = req.body;

  try {
    const prescription = await Prescription.create({
      appointmentId,
      patientId,
      doctorId: req.user.id,
      medications,
      instructions
    });
    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPrescriptions = async (req, res) => {
  try {
    const where = {};
    if (req.user.role === 'Doctor') where.doctorId = req.user.id;
    if (req.user.role === 'Patient') {
      const patient = await Patient.findOne({ where: { userId: req.user.id } });
      if (!patient) return res.status(404).json({ message: 'Patient profile not found' });
      where.patientId = patient.id;
    }
    // Pharmacy can see all if they are searching for a patient specifically, otherwise we can filter if needed.
    // For now, let's allow them to see what they search for in their dashboard.

    const prescriptions = await Prescription.findAll({
      where,
      include: [
        { model: Patient, as: 'patient', include: [{ model: User, as: 'user', attributes: ['name'] }] },
        { model: User, as: 'doctor', attributes: ['name'] }
      ]
    });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
export const updatePrescriptionStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const prescription = await Prescription.findByPk(id);
    if (!prescription) return res.status(404).json({ message: 'Prescription not found' });

    prescription.status = status;
    await prescription.save();
    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
