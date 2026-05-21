import { User, Patient, Appointment, Prescription, LabTest, LabReport } from '../models/index.js';
import { generatePatientId, generateQRCode } from '../utils/utils.js';

export const registerPatient = async (req, res) => {
  const { userId, password, name, age, gender, email, mobile, address } = req.body;

  try {
    const userExists = await User.findOne({ where: { userId } });
    if (userExists) {
      return res.status(400).json({ message: 'User ID already exists' });
    }

    const patientId = generatePatientId();
    const qrCode = await generateQRCode(patientId);

    const newUser = await User.create({
      userId,
      password,
      name,
      role: 'Patient',
      email,
      mobile,
      address
    });

    const newPatient = await Patient.create({
      userId: newUser.id,
      patientId,
      age,
      gender,
      qrCode
    });

    res.status(201).json({
      id: newUser.id,
      userId: newUser.userId,
      patientId: newPatient.patientId,
      name: newUser.name,
      role: newUser.role,
      qrCode: newPatient.qrCode
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPatientProfile = async (req, res) => {
    try {
        const patient = await Patient.findOne({
            where: { patientId: req.params.patientId },
            include: [{ model: User, as: 'user' }]
        });

        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.findAll({
            include: [{ model: User, as: 'user', attributes: ['name', 'mobile', 'userId'] }]
        });
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
export const getMyProfile = async (req, res) => {
    try {
        const patient = await Patient.findOne({
            where: { userId: req.user.id },
            include: [{ model: User, as: 'user', attributes: ['name', 'mobile', 'userId', 'address', 'email'] }]
        });

        if (!patient) return res.status(404).json({ message: 'Patient profile not found' });
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
export const getPatientHistory = async (req, res) => {
    const { id } = req.params;
    try {
        const patient = await Patient.findByPk(id, {
            include: [
                { model: User, as: 'user', attributes: ['name', 'userId'] },
                { 
                    model: Appointment, 
                    as: 'appointments',
                    include: [{ model: User, as: 'doctor', attributes: ['name'] }]
                },
                { 
                    model: Prescription, 
                    as: 'prescriptions',
                    include: [{ model: User, as: 'doctor', attributes: ['name'] }]
                },
                { 
                    model: LabTest, 
                    as: 'labTests',
                    include: [
                        { model: User, as: 'doctor', attributes: ['name'] },
                        { model: LabReport, as: 'report' }
                    ]
                }
            ]
        });

        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
