export default {
  port: 'PORT',
  dbURL: process.env.NODE_ENV === 'test' ? 'TEST_DATABASE_URL' : 'DATABASE_URL',
  accessTokenPrivateKey: 'JWT_ACCESS_TOKEN_PRIVATE_KEY',
  accessTokenPublicKey: 'JWT_ACCESS_TOKEN_PUBLIC_KEY',
};
