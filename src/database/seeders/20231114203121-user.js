'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    const userList = Array.from({ length: 10 }).map((_) => ({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: '$2a$12$7e4l13Ozf.5I8H/rmbY/Gu6oWk747TS3qB53T62nArKEUqbGv09h.', // password
      role: 'user',
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert('users', [
      {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: 'admin.user@mail.com',
        password:
          '$2a$12$7e4l13Ozf.5I8H/rmbY/Gu6oWk747TS3qB53T62nArKEUqbGv09h.',
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      ...userList,
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {});
  },
};
