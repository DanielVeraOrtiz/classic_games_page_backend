const Router = require('koa-router');
const users = require('./routes/users.js');
const authRoutes = require('./routes/authentication.js');
const jwtMiddleware = require('koa-jwt'); // Para proteger rutas
const dotenv = require('dotenv');
const favorites = require('./routes/favorites.js');
const testRoutes = require('./routes/test.js');

dotenv.config();
// Se define el router de koa y que use las rutas definidas para cada modelo
// que al final logran mapear el path de la request a un trozo de codigo con el comportamiento
// especifico buscado.

const router = new Router();
router.use(authRoutes.routes());
if (process.env.NODE_ENV === 'test') {
  router.use(testRoutes.routes());
}

// Las rutas protegidas empiezan desde la siguiente linea de codigo
router.use(jwtMiddleware({ secret: process.env.JWT_SECRET })); // Esta
router.use('/users', users.routes());
router.use('/favorites', favorites.routes());

module.exports = router;
