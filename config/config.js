require('dotenv').config();

// This is use for the sequelize-cli

const dbURL =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

const logging = process.env.NODE_ENV === 'test' ? false : true;

module.exports = {
  development: {
    url: dbURL,
    dialect: 'mysql',
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: 'mysql',
    logging: false,
  },
};
