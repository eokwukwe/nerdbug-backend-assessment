import bcrypt from 'bcryptjs';

export function createHash(plainString: string) {
  return bcrypt.hashSync(plainString, 12);
}

export function compareHash(plainString: string, hashedString: string) {
  return bcrypt.compareSync(plainString, hashedString);
}
