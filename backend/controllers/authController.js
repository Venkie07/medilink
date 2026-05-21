import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const login = async (req, res) => {
  const { userId, password } = req.body;

  try {
    const user = await User.findOne({ where: { userId } });

    if (user && (await user.comparePassword(password))) {
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.json({
        id: user.id,
        userId: user.userId,
        name: user.name,
        role: user.role,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        hospitalName: user.hospitalName,
        certifiedId: user.certifiedId,
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid User ID or Password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMe = async (req, res) => {
  res.json(req.user);
};
