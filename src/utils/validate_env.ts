import { cleanEnv, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    PORT: port(),
    DATABASE_URL: str(),
    TEST_DATABASE_URL: str(),
    JWT_ACCESS_TOKEN_PUBLIC_KEY: str(),
    JWT_ACCESS_TOKEN_PRIVATE_KEY: str(),
  });
};

export default validateEnv;
