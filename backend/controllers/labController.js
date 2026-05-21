import { LabTest, LabReport, Patient, User } from '../models/index.js';

export const requestLabTest = async (req, res) => {
  const { patientId, testName } = req.body;

  try {
    const labTest = await LabTest.create({
      patientId,
      doctorId: req.user.id,
      testName
    });
    res.status(201).json(labTest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const uploadReport = async (req, res) => {
  const { labTestId, resultSummary } = req.body;
  const filePath = req.file ? req.file.path : null;

  if (!filePath) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const labReport = await LabReport.create({
      labTestId,
      technicianId: req.user.id,
      filePath,
      resultSummary
    });
    await LabTest.update({ status: 'Completed' }, { where: { id: labTestId } });
    res.status(201).json(labReport);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getLabTests = async (req, res) => {
  try {
    const where = {};
    if (req.user.role === 'Doctor') where.doctorId = req.user.id;
    if (req.user.role === 'Patient') {
        const patient = await Patient.findOne({ where: { userId: req.user.id } });
        if (!patient) return res.status(404).json({ message: 'Patient profile not found' });
        where.patientId = patient.id;
    }

    const labTests = await LabTest.findAll({
      where,
      include: [
        { model: Patient, as: 'patient', include: [{ model: User, as: 'user', attributes: ['name'] }] },
        { model: User, as: 'doctor', attributes: ['name'] },
        { model: LabReport, as: 'report' }
      ]
    });
    res.json(labTests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
