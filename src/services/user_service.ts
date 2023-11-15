import User from '../database/models/user';
import { CreateUserInput } from '../schemas';

export class UserService {
  static model = User;

  static async create(payload: CreateUserInput) {
    const record = await this.model.create(payload);
    return record.toJSON();
  }
}
