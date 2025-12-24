const Router = require('koa-router');
// Mejor importar el modelo que usar ctx.orm.model
const { User, Favorite } = require('../models');
const { authMiddleware } = require('../lib/auth/jwt');
const router = new Router();

router.get('/me', authMiddleware, async (ctx) => {
    try {
        const userFavorites = await Favorite.findAll({
            where: {user_id: ctx.state.user.sub}
        });
        ctx.body = userFavorites;
        ctx.status = 200;
    } catch (err) {
        ctx.status = 400;
        ctx.body = err;
    }
})

router.post('/', authMiddleware, async (ctx) => {
    try {
        const favorite = await Favorite.create( ctx.request.body );
        ctx.body = favorite;
        ctx.status = 200;
    } catch (err) {
        ctx.body = err;
        ctx.status = 400;
    }
})

module.exports = router;