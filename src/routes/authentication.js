const Router = require('koa-router');
const { User } = require('../models');
const router = new Router();
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { createToken } = require('../lib/auth/jwt');

dotenv.config();

// Si no existe ya el usuario, entonces que lo cree
router.post('authentication.signup', '/signup', async (ctx) => {
  try {
    const authInfo = ctx.request.body;
    const existingUser = await User.findOne({
      where: { email: authInfo.email },
    });

    // test de bcrypt es innecesario, pero la validacion de la bdd de password
    // deberia hacerse aqui, porque en la bdd se guarda hashedPassword.
    // Entonces seria hacer una funcion, ponerla aqui y testearla por fuera con UT.
    if (existingUser) {
      ctx.body = `The user by that email already exists`;
      ctx.status = 400;
      return;
    }

    const saltRounds = 10; // Como cuantas veces la hashea, entre mas es mas seguro, pero mas lento
    const hashedPassword = await bcrypt.hash(authInfo.password, saltRounds);

    const user = await User.create({
      username: authInfo.username,
      email: authInfo.email,
      password: hashedPassword,
    });

    const token = createToken(['user'], user.id, '24h');

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
    ctx.body = err.errors[0].message; // Que no filtre errores con informacion sensible
    ctx.status = 400;
  }
});

// De existir el usuario y coincidan las contrasenas, entonces con jsonwebtoken vamos a firmar el jwt
// que se lo entregaremos en la response con una vigencia de 24 horas.
router.post('authentication.login', '/login', async (ctx) => {
  try {
    const authInfo = ctx.request.body;
    const user = await User.findOne({ where: { email: authInfo.email } });

    if (!user) {
      ctx.body = `Incorrect email or password`;
      ctx.status = 400;
      return;
    }

    const validPassword = await bcrypt.compare(authInfo.password, user.password); // Es una promesa

    if (!validPassword) {
      ctx.body = 'Incorrect email or password';
      ctx.status = 400;
      return;
    }

    const token = createToken(['user'], user.id, '24h');

    ctx.status = 200;
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
  } catch (error) {
    ctx.body = 'Could not sign in';
    ctx.status = 400;
    return;
  }
});

module.exports = router;
