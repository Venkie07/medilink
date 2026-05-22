import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/UserRepository.js';
import { AppError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';

const ACCESS_TOKEN_EXPIRY  = '15m';   // Short-lived access token
const REFRESH_TOKEN_EXPIRY = '7d';    // Longer-lived refresh token stored in HTTP-only cookie

class AuthService {
  generateAccessToken(user) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError('Server error: JWT key not configured.', 500);
    return jwt.sign(
      { id: user.id, role: user.role },
      secret,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
  }

  generateRefreshToken(user) {
    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh';
    return jwt.sign(
      { id: user.id },
      secret,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
  }

  _setRefreshCookie(res, refreshToken) {
    res.cookie('medilink_refresh', refreshToken, {
      httpOnly: true,                              // Not accessible from JS
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,           // 7 days in ms
    });
  }

  async login(userId, password, res) {
    const user = await UserRepository.findByUserId(userId);
    if (!user) throw new AppError('Invalid credentials.', 401);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new AppError('Invalid credentials.', 401);

    const accessToken  = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Persist refresh token in secure HTTP-only cookie
    this._setRefreshCookie(res, refreshToken);

    logger.info(`User login: ${user.userId} (${user.role})`);

    return {
      token: accessToken,
      id: user.id,
      userId: user.userId,
      name: user.name,
      role: user.role,
      email: user.email,
      mobile: user.mobile,
      address: user.address,
      hospitalName: user.hospitalName,
      certifiedId: user.certifiedId,
    };
  }

  async refreshAccessToken(req, res) {
    const token = req.cookies?.medilink_refresh;
    if (!token) throw new AppError('No refresh token provided.', 401);

    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh';
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch {
      throw new AppError('Refresh token expired or invalid. Please log in again.', 401);
    }

    const user = await UserRepository.findById(decoded.id);
    if (!user) throw new AppError('User no longer exists.', 401);

    const newAccessToken = this.generateAccessToken(user);
    const newRefreshToken = this.generateRefreshToken(user);

    // Rotate refresh token on each use (one-time use pattern)
    this._setRefreshCookie(res, newRefreshToken);

    return { token: newAccessToken };
  }

  logout(res) {
    res.clearCookie('medilink_refresh', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    logger.info('User logged out — refresh cookie cleared.');
  }

  async getCurrentUser(id) {
    const user = await UserRepository.findById(id);
    if (!user) throw new AppError('User profile not found.', 404);
    return user;
  }
}

export default new AuthService();
