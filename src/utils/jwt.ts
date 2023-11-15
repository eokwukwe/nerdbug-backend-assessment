import config from 'config';
import jwt, { SignOptions } from 'jsonwebtoken';

export function signJwt(
  payload: Object,
  keyName: 'accessTokenPrivateKey',
  options: SignOptions
) {
  const privateKey = Buffer.from(
    config.get<string>(keyName),
    'base64'
  ).toString('ascii');

  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
}

export function verifyJwt<T>(
  token: string,
  keyName: 'accessTokenPublicKey'
): T | null {
  try {
    const publicKey = Buffer.from(
      config.get<string>(keyName),
      'base64'
    ).toString('ascii');

    const decoded = jwt.verify(token, publicKey) as T;

    return decoded;
  } catch (error) {
    return null;
  }
}