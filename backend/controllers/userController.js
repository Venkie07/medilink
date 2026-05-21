import { User, Patient } from '../models/index.js';
import bcrypt from 'bcrypt';

export const createUser = async (req, res) => {
  const { userId, password, name, role, email, mobile } = req.body;

  try {
    const userExists = await User.findOne({ where: { userId } });

    if (userExists) {
      return res.status(400).json({ message: 'User ID already exists' });
    }

    const newUser = await User.create({
      userId,
      password,
      name,
      role,
      email,
      mobile
    });

    res.status(201).json({
      id: newUser.id,
      userId: newUser.userId,
      name: newUser.name,
      role: newUser.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ 
      attributes: { exclude: ['password'] },
      include: [{ model: Patient, as: 'patientProfile' }]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, address, password, hospitalName, certifiedId, age, gender } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update common fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.mobile = mobile || user.mobile;
    user.address = address || user.address;
    user.hospitalName = hospitalName || user.hospitalName;
    user.certifiedId = certifiedId || user.certifiedId;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    // Update patient profile if user is a patient
    if (user.role === 'Patient') {
      const patient = await Patient.findOne({ where: { userId: user.userId } });
      if (patient) {
        patient.age = age || patient.age;
        patient.gender = gender || patient.gender;
        await patient.save();
      }
    }

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
