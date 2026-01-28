const { Favorite } = require('../../models');

async function createFavorite(userId, gameId) {
  return await Favorite.create({
    user_id: userId,
    game_id: gameId,
  });
}

async function destroyFavorite(favoriteId) {
  return await Favorite.destroy({
    where: { id: favoriteId },
  });
}

async function findFavorite(favoriteId) {
  return await Favorite.findByPk(favoriteId);
}

module.exports = { createFavorite, destroyFavorite, findFavorite };
