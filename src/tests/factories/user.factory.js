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
  return User.create(buildUser(overrides));
}

module.exports = {
  buildUser,
  createUser,
};
