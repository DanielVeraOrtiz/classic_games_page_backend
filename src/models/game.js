'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Favorite, {
        foreignKey: 'game_id',
        as: 'favorites',
      });
    }
  }
  Game.init(
    {
      title: DataTypes.STRING,
      imgUrl: DataTypes.STRING,
      category: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Game',
    },
  );
  return Game;
};
