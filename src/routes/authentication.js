const Router = require('koa-router');
var jwt = require('jsonwebtoken');
const { User } = require('../models');
const router = new Router();

router.post('authentication.signup', '/signup', async (ctx) => {
    try {
        const authInfo = ctx.request.body;
        const existingUser = await User.findOne({
            where: { email: authInfo.email }
        });

        if (existingUser) {
            ctx.body = `The user by the email '${authInfo.email}' already exists`;
            ctx.status = 400;
            return;
        }

        const user = await User.create({
            username: authInfo.username,
            email: authInfo.email,
            password: authInfo.password,
        });

        ctx.body = {
            username: user.username,
            email: user.email,
        }
        ctx.status = 201;

    } catch (err) {
        console.error('Error: ', err);
        ctx.body = err;
        ctx.status = 400;
    }
})

module.exports = router;