'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('Favorites', ['user_id', 'game_id'], {
      unique: true,
      name: 'favorites_user_game_unique',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('Favorites', 'favorites_user_game_unique');
  },
};
