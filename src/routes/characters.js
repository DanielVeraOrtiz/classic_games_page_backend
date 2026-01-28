const Router = require('koa-router');

const router = new Router();

const characters = [
  {
    name: 'Bart Simpson',
    age: 12,
    description: 'Ni idea',
  },
];

router.get('characters.show', '/show', async (ctx) => {
  ctx.type = 'application/json';
  ctx.status = 200;
  ctx.body = characters;
});

module.exports = router;
