'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Favorite, {
        foreignKey: 'user_id',
        as: 'favorites',
      });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlphanumeric: {
            msg: 'Username musb be alphanumeric',
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: 'mail must have email format',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isValidPassword(value) {
            if (!value.match(/[a-z]/) || !value.match(/[0-9]/) || !value.match(/[@$!%*?&]/)) {
              throw new Error(
                'The password must contain at least a letter, one number and one special character',
              );
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  return User;
};
