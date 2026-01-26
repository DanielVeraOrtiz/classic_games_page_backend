const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// A pesar de que venia de la capsula, al final no usa try y catch lo cual no capta los problemas de verify
// const getJWTScope = (token) => {
//     const secret = process.env.JWT_SECRET;
//     const payload = jwt.verify(token, secret); // { scope: [ 'admin' ], iat: 1765997603, exp: 1766084003, sub: '7' }
//     return payload.scope;
// };

// El next deja pendiente el codigo y se ejecuta el handler del router.get o post lo que sea
// en este caso conviene ver si tiene el token correcto y si no pa fuera. En caso que lo tenga entonces
// next al codigo dentro del handler.

const isUser = async (ctx, next) => {
  ctx.assert(ctx.state.user.scope.includes('user'), 403, 'You are not a user');
  await next();
};

const isAdmin = async (ctx, next) => {
  ctx.assert(ctx.state.user.scope.includes('admin'), 403, 'You are not a admin');
  await next();
};

const authMiddleware = async (ctx, next) => {
  const auth = ctx.request.header.authorization;
  ctx.assert(auth, 401, 'Missing Authorization header');

  const token = auth.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.user = payload;
    await next();
  } catch (err) {
    console.error('Error: ', err);
    ctx.status = 401;
  }
};

module.exports = { authMiddleware, isUser, isAdmin };
