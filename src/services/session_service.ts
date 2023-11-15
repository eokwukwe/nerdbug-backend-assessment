import config from 'config';

import User from '../database/models/user';
import Session from '../database/models/session';

export class SessionService {
  static model = Session;

  static async create(user: User) {
    return await this.model.create({
      user_id: user.id,
      // 60 minutes * 60 seconds * 1000 milliseconds = 1 hour
      expires_at: new Date(
        Date.now() + config.get<number>('accessTokenExpiresIn') * 60 * 1000
      ),
    });
  }

  static async delete(id: number) {
    await this.model.destroy({ where: { id } });
  }

  static async getById(id: number) {
    return await this.model.findOne({
      where: { id },
      include: [{ model: User, attributes: { exclude: ['password'] } }],
    });
  }
}
