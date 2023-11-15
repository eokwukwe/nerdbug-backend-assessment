import config from 'config';
import HttpError from '../utils/http_error';

import { LoginInput } from '../schemas';
import { UserService } from './user_service';
import { compareHash } from '../utils/bcrypt';
import { signJwt, verifyJwt } from '../utils/jwt';
import { SessionService } from './session_service';

export class AuthService {
  static async login(payload: LoginInput) {
    const user = await UserService.getOne({ email: payload.email });

    if (!user) {
      throw new HttpError('Invalid email or password', 401);
    }

    if (!compareHash(payload.password, user.password)) {
      throw new HttpError('Invalid email or password', 401);
    }

    // Create session
    const session = await SessionService.create(user);

    // Generate access token
    const accessToken = await this.generateAccessToken(session.id);

    return accessToken;
  }

  static async logout(id: number) {
    return await SessionService.delete(id);
  }

  static async generateAccessToken(sessionId: number) {
    return signJwt({ sub: sessionId }, 'accessTokenPrivateKey', {
      expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
    });
  }

  static async verifyAccessToken(token: string) {
    return verifyJwt<{ sub: number }>(token, 'accessTokenPublicKey');
  }
}
