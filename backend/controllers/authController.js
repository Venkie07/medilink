import AuthService from '../services/AuthService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const login = asyncHandler(async (req, res) => {
  const { userId, password } = req.body;
  // Pass res so AuthService can set the HTTP-only refresh cookie
  const result = await AuthService.login(userId, password, res);
  res.status(200).json(result);
});

export const refresh = asyncHandler(async (req, res) => {
  // Read cookie and issue new access + refresh tokens
  const result = await AuthService.refreshAccessToken(req, res);
  res.status(200).json(result);
});

export const logout = asyncHandler(async (req, res) => {
  AuthService.logout(res);
  res.status(200).json({ message: 'Logged out successfully.' });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await AuthService.getCurrentUser(req.user.id);
  res.status(200).json(user);
});
