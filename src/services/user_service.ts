import User from '../database/models/user';
import { CreateUserInput, UpdateUserInput } from '../schemas';

export class UserService {
  static model = User;

  static async create(payload: CreateUserInput) {
    const record = await this.model.create(payload);
    return record.toJSON();
  }

  static async getAll() {
    return await this.model.findAll({
      attributes: { exclude: ['password'] },
    });
  }

  static async getById(id: number) {
    return await this.model.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
  }

  static async deleteById(id: number) {
    return await this.model.destroy({ where: { id } });
  }

  static async updateById(id: number, payload: UpdateUserInput) {
    return await this.model.update(payload!, {
      where: { id },
      returning: true,
    });
  }
}
