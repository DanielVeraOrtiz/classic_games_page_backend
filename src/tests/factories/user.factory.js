const { User } = require('../../models');

let counter = 1;

function buildUser(overrides = {}) {
  return {
    username: `user${counter}`,
    email: `user${counter++}@email.com`,
    password: 'Password1$',
    ...overrides,
  };
}

async function createUser(overrides = {}) {
  return await User.create(buildUser(overrides));
}

async function destroyUser(userId) {
  return await User.destroy({
    where: { id: userId },
  });
}

async function findUser(userId) {
  return await User.findByPk(userId);
}

module.exports = {
  buildUser,
  createUser,
  destroyUser,
  findUser,
};
