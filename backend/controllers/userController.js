import UserService from '../services/UserService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const createUser = asyncHandler(async (req, res) => {
  const user = await UserService.createUser(req.body);
  res.status(201).json({
    id: user.id,
    userId: user.userId,
    name: user.name,
    role: user.role,
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await UserService.getAllUsers();
  res.status(200).json(users);
});

export const updateUser = asyncHandler(async (req, res) => {
  const updated = await UserService.updateUser(req.params.id, req.body);
  res.status(200).json({ message: 'User updated successfully', user: updated });
});
