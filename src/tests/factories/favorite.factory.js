const { Favorite } = require('../../models');

async function createFavorite(userId, gameId) {
  const favorite = Favorite.create({
    user_id: userId,
    game_id: gameId,
  });

  return favorite;
}

module.exports = { createFavorite };
