import { User } from '../models/index.js';

class UserRepository {
  async findById(id, excludePassword = true) {
    const options = {};
    if (excludePassword) {
      options.attributes = { exclude: ['password'] };
    }
    return await User.findByPk(id, options);
  }

  async findByUserId(userId) {
    return await User.findOne({ where: { userId } });
  }

  async findAll() {
    return await User.findAll({
      attributes: { exclude: ['password'] },
    });
  }

  async create(userData) {
    return await User.create(userData);
  }

  async update(id, updateData) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update(updateData);
  }
}

export default new UserRepository();
