'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Users', [
      {
        username: 'demo_user',
        email: 'demo@example.com',
        password: 'password123', // Hay que usar bcrypt o pegar el resultado de un bcrypt
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password456', // Hay que usar bcrypt o pegar el resultado de un bcrypt
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
