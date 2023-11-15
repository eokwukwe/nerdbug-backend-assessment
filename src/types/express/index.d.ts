import { BaseUser } from '../../schemas';

declare global {
  namespace Express {
    export interface Request {
      user: (BaseUser & { id: number }) | null;
      session: number;
    }
  }
}
