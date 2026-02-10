const Router = require('koa-router');
const dotenv = require('dotenv');
const { sequelize, User } = require('../models');
const bcrypt = require('bcrypt');

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

  router.post('/api/test/users', async (ctx) => {
    try {
      if (ctx.headers['x-test-token'] !== process.env.TEST_TOKEN) {
        ctx.status = 401;
        ctx.body = { error: 'Unauthorized' };
        return;
      }
      const hashedPassword = await bcrypt.hash(ctx.request.body.password, 10);
      const user = await User.create({
        ...ctx.request.body,
        password: hashedPassword,
      });
      ctx.status = 201;
      ctx.body = user;
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
