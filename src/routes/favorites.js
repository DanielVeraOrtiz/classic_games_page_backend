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
});

router.get('/:gameid', authMiddleware, async (ctx) => {
    try {
        const favorite = Favorite.findOne({ where: {
            user_id: ctx.state.user.sub,
            game_id: ctx.params.id,
        }});
        ctx.body = favorite;
        ctx.status = 201;
    } catch (error) {
        ctx.body = error;
        ctx.status = 400;
    }
});

router.post('/', authMiddleware, async (ctx) => {
    try {
        const favorite = await Favorite.create( ctx.request.body );
        ctx.body = favorite;
        ctx.status = 200;
    } catch (err) {
        ctx.body = err;
        ctx.status = 400;
    }
});

router.delete('/:id', authMiddleware, async (ctx) => {
    try {
        const deletedCount = await Favorite.destroy({
            where: {
                game_id: ctx.params.id,
                user_id: ctx.state.user.sub,
             }
        });

        if (deletedCount === 0) {
            ctx.status = 404;
            ctx.body = {error: 'Favorite not fount'}
            return;
        }

        ctx.status = 204;
    } catch (err) {
        ctx.body = { error: 'Internal server error' };
        ctx.status = 500;
    }
});

module.exports = router;