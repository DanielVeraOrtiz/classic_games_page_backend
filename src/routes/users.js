const Router = require('koa-router');
// Mejor importar el modelo que usar ctx.orm.model
const { User } = require('../models');
const router = new Router();

router.get('users.list', '/', async (ctx) => {
    try {
        const users = await User.findAll();
        ctx.body = users;
        ctx.status = 200;
    } catch (err) {
        ctx.body = err;
        ctx.status = 400;
    }
});

router.get('users.show', '/:id', async (ctx) => {
    try {
        // const user = await User.findByPk(ctx.params.id);
        const user = await User.findOne({ where:{id:ctx.params.id} });
        ctx.body = user;
        ctx.status = 200;
    } catch (err) {
        ctx.body = err;
        ctx.status = 400;
    }
});

module.exports = router;
