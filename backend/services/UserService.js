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
}

export default new UserService();
