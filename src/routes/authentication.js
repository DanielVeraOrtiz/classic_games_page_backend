const Router = require('koa-router');
var jwt = require('jsonwebtoken'); // Para firmar tokens
const { User } = require('../models');
const router = new Router();
const dotenv = require('dotenv');

dotenv.config();

// Si no existe ya el usuario, entonces que lo cree
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

        // Payload JWT - Cambiado para que devuelva el JWT
        const payload = {
            scope: ['user'],
        };

        const secret = process.env.JWT_SECRET;
        
        // Opciones del token
        const options = {
            subject: user.id.toString(), // "sub": id del usuario
            expiresIn: '24h'              // expiración
        };

        const token = jwt.sign(payload, secret, options);

        ctx.status = 201;
        ctx.body = {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
            access_token: token,
            token_type: 'Bearer',
            expires_in: 24 * 60 * 60,
        };
    } catch (err) {
        ctx.body = { error: 'Could not create user' }; // Que no filtre errores con informacion sensible
        ctx.status = 400;
    }
})


// De existir el usuario y coincidan las contrasenas, entonces con jsonwebtoken vamos a firmar el jwt
// que se lo entregaremos en la response con una vigencia de 24 horas.
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
        ctx.body = { error: 'Could not sign in' };
        ctx.status = 400;
        return;
    }
})

module.exports = router;