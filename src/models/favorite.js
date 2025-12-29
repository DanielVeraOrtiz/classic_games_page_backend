'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
      this.belongsTo(models.Game, {
        foreignKey: 'game_id',
        as: 'game',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    }
  }
  Favorite.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    game_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Favorite',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'game_id'],
      }
    ]
  });
  return Favorite;
};