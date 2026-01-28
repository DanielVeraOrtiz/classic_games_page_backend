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
  return await Game.create(buildGame(overrides));
}

async function destroyGame(gameId) {
  return await Game.destroy({
    where: { id: gameId },
  });
}

async function findGame(gameId) {
  return await Game.findByPk(gameId);
}

module.exports = { buildGame, createGame, destroyGame, findGame };
