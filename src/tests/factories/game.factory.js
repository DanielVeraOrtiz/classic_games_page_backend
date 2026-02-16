const { Game } = require('../../models');

let counter = 1;

// El id se manda manual al crear en la bdd, por lo tanto no se resetean estos indices
// con el .sync de la función resetDatabase. Eso me dio problema de hecho y tuve que sobrescribirlo
// por el i del for i...
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
