import UserRepository from '../repositories/UserRepository.js';
import { AppError } from '../middleware/errorHandler.js';

class UserService {
  async createUser(userData) {
    const existingUser = await UserRepository.findByUserId(userData.userId);
    if (existingUser) {
      throw new AppError('User ID already exists.', 409);
    }
    return await UserRepository.create(userData);
  }

  async getAllUsers() {
    return await UserRepository.findAll();
  }

  async updateUser(id, updateData) {
    const updatedUser = await UserRepository.update(id, updateData);
    if (!updatedUser) {
      throw new AppError('User not found.', 404);
    }
    return updatedUser;
  }

  async deleteUser(id, adminId, adminPassword) {
    if (!adminPassword) {
      throw new AppError('Admin confirmation password is required.', 400);
    }

    const admin = await UserRepository.findById(adminId, false);
    if (!admin) {
      throw new AppError('Admin user not found.', 404);
    }

    const isMatch = await admin.comparePassword(adminPassword);
    if (!isMatch) {
      throw new AppError('Invalid administrator password.', 401);
    }

    if (id === adminId) {
      throw new AppError('Self-deletion is prohibited.', 400);
    }

    const deleted = await UserRepository.delete(id);
    if (!deleted) {
      throw new AppError('User to delete not found.', 404);
    }
    return true;
  }
}

export default new UserService();
