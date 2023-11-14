require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'mysql',
    logging: true,
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: 'mysql',
    logging: true,
  },
};
