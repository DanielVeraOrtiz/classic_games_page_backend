const Router = require('koa-router');
// Mejor importar el modelo que usar ctx.orm.model
const { Favorite, Game } = require('../models');
const router = new Router();

router.get('/me', async (ctx) => {
  try {
    const userFavorites = await Favorite.findAll({
      where: { user_id: ctx.state.user.sub },
      include: { model: Game, as: 'game' },
    });
    if (userFavorites.length === 0) {
      ctx.status = 400;
      ctx.body = 'Favorites not found';
      return;
    }

    ctx.body = userFavorites;
    ctx.status = 200;
  } catch (err) {
    ctx.status = 400;
    ctx.body = err;
  }
});

router.get('/:gameid', async (ctx) => {
  try {
    const favorite = await Favorite.findOne({
      where: {
        user_id: ctx.state.user.sub,
        game_id: ctx.params.gameid,
      },
    });
    if (!favorite) {
      ctx.throw(404, 'Favorite not found');
    }
    ctx.body = favorite;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

router.post('/', async (ctx) => {
  try {
    await Game.findOrCreate({
      where: { id: ctx.request.body.game_id },
      defaults: {
        id: ctx.request.body.game_id,
        title: ctx.request.body.title,
        category: ctx.request.body.category,
        imgUrl: ctx.request.body.imgUrl,
      },
    });
    const favorite = await Favorite.create({
      game_id: ctx.request.body.game_id,
      user_id: ctx.request.body.user_id,
    });
    ctx.body = favorite;
    ctx.status = 200;
  } catch (err) {
    ctx.body = err;
    ctx.status = 400;
  }
});

router.delete('/:id', async (ctx) => {
  try {
    const deletedCount = await Favorite.destroy({
      where: {
        game_id: ctx.params.id,
        user_id: ctx.state.user.sub,
      },
    });

    if (deletedCount === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Favorite not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = deletedCount;
  } catch {
    ctx.body = { error: 'Internal server error' };
    ctx.status = 500;
  }
});

module.exports = router;
