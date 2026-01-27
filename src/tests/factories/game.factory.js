const { Game } = require('../../models');

let counter = 1;

function buildGame(overrides = {}) {
  return {
    id: counter,
    title: `game${counter}`,
    imgUrl: `game${counter++}.url`,
    category: `fight`,
    ...overrides,
  };
}

async function createGame(overrides = {}) {
  return Game.create(buildGame(overrides));
}

module.exports = { buildGame, createGame };
