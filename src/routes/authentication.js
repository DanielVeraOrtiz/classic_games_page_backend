const Router = require('koa-router');
var jwt = require('jsonwebtoken');
const { User } = require('../models');
const router = new Router();
const dotenv = require('dotenv');

dotenv.config();

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

router.post("authentication.login", "/login", async (ctx) => {
    try {
        const authInfo = ctx.request.body
        const user = await User.findOne({ where:{ email:authInfo.email } });

        if (!user) {
            ctx.body = `The user by the email '${authInfo.email}' was not found`;
            ctx.status = 400;
            return;
        }

        if (!(user.password == authInfo.password)) {
            ctx.body = "Incorrect email or password";
            ctx.status = 400;
            return;
        }

        // ===================== JWT =====================
        // Payload: información que se incluye dentro del token.
        // NO está cifrada, solo firmada.
        const payload = {
        scope: ['user']
        };

        // Secret: clave privada del backend (NUNCA va al cliente)
        const secret = process.env.JWT_SECRET;

        // Opciones del token
        const options = {
            subject: user.id.toString(), // "sub": id del usuario
            expiresIn: '24h'              // expiración
        };

        // Firma del JWT:
        // header + payload + secret -> signature
        const token = jwt.sign(payload, secret, options);
        // ==============================================

        ctx.status = 200;
        ctx.body = {
        access_token: token,
        token_type: 'Bearer',
        expires_in: 24 * 60 * 60,
        };
    }
    catch(error) {
        ctx.body = error;
        ctx.status = 400;
        return;
    }
})

module.exports = router;