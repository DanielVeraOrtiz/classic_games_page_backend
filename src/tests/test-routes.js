const Router = require('koa-router');
const dotenv = require('dotenv');
const { sequelize, User, Game, Favorite } = require('../models');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

dotenv.config();

const router = new Router();

if (process.env.NODE_ENV === 'test' && process.env.ENABLE_TEST_ROUTES === 'true') {
  router.post('/api/test/reset-db', async (ctx) => {
    if (ctx.headers['x-test-token'] !== process.env.TEST_TOKEN) {
      ctx.status = 401;
      ctx.body = { error: 'Unauthorized' };
      return;
    }

    await sequelize.sync({ force: true });

    ctx.status = 200;
    ctx.body = { ok: true };
  });

  // No usaremos los factories, son de jest y queremos que no dependa de que los workers compartan memoria
  // sino que siempre sean unicos.
  // POST y DELETE Users para Test
  router.post('/api/test/users', async (ctx) => {
    if (ctx.headers['x-test-token'] !== process.env.TEST_TOKEN) {
      ctx.status = 401;
      return;
    }

    const unique = crypto.randomUUID();

    const hashedPassword = await bcrypt.hash('Password1$', 10);

    const user = await User.create({
      username: `e2e`,
      email: `e2e-${unique}@email.com`,
      password: hashedPassword,
    });

    ctx.body = {
      ...user.toJSON(),
      password: 'Password1$',
    };
  });

  router.delete('/api/test/users/:id', async (ctx) => {
    try {
      if (ctx.headers['x-test-token'] !== process.env.TEST_TOKEN) {
        ctx.status = 401;
        ctx.body = { error: 'Unauthorized' };
        return;
      }
      await User.destroy({ where: { id: ctx.params.id } });
      ctx.status = 204;
    } catch (err) {
      console.error('Sequelize error:', err);
      console.error('Original:', err.original);
      ctx.status = 400;
      ctx.body = {
        error: err.original?.message || err.message,
      };
    }
  });

  // POST y DELETE Game para test
  router.post('/api/test/games', async (ctx) => {
    if (ctx.headers['x-test-token'] !== process.env.TEST_TOKEN) {
      ctx.status = 401;
      return;
    }

    const unique = crypto.randomUUID();
    const workerId = Number(ctx.request.body.workId ?? 0);
    const base = workerId * 10_000_000;
    const uniqueId = base + Math.floor(Math.random() * 10_000_000);

    const game = await Game.create({
      id: uniqueId,
      title: `game${unique}`,
      imgUrl: `game${unique}.url`,
      category: `fight`,
    });

    ctx.body = game;
    ctx.status = 201;
  });

  router.delete('/api/test/games/:id', async (ctx) => {
    try {
      if (ctx.headers['x-test-token'] !== process.env.TEST_TOKEN) {
        ctx.status = 401;
        ctx.body = { error: 'Unauthorized' };
        return;
      }
      await Game.destroy({ where: { id: ctx.params.id } });
      ctx.status = 204;
    } catch (err) {
      console.error('Sequelize error:', err);
      console.error('Original:', err.original);
      ctx.status = 400;
      ctx.body = {
        error: err.original?.message || err.message,
      };
    }
  });

  // POST y DELETE de Favorite
  router.post('/api/test/favorites', async (ctx) => {
    if (ctx.headers['x-test-token'] !== process.env.TEST_TOKEN) {
      ctx.status = 401;
      return;
    }

    const favorite = await Favorite.create({
      user_id: ctx.request.body.userId,
      game_id: ctx.request.body.gameId,
    });

    ctx.body = favorite;
    ctx.status = 201;
  });

  router.delete('/api/test/favorites/:id', async (ctx) => {
    try {
      if (ctx.headers['x-test-token'] !== process.env.TEST_TOKEN) {
        ctx.status = 401;
        ctx.body = { error: 'Unauthorized' };
        return;
      }
      await Favorite.destroy({ where: { id: ctx.params.id } });
      ctx.status = 204;
    } catch (err) {
      console.error('Sequelize error:', err);
      console.error('Original:', err.original);
      ctx.status = 400;
      ctx.body = {
        error: err.original?.message || err.message,
      };
    }
  });
}

module.exports = router;
