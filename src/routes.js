const Router = require('koa-router');
const characters = require('./routes/characters.js');
const users = require('./routes/users.js');
const authRoutes = require('./routes/authentication.js');
const jwtMiddleware = require('koa-jwt'); // Para proteger rutas
const dotenv = require('dotenv');
const scopeProtectedRoutes = require('./routes/scopeExample.js');

dotenv.config();
// Se define el router de koa y que use las rutas definidas para cada modelo
// que al final logran mapear el path de la request a un trozo de codigo con el comportamiento
// especifico buscado.

const router = new Router();
router.use('/characters', characters.routes());
router.use(authRoutes.routes());

// Las rutas protegidas empiezan desde la siguiente linea de codigo
router.use(jwtMiddleware({secret: process.env.JWT_SECRET})); // Esta
router.use('/users', users.routes());
router.use('/scope-example', scopeProtectedRoutes.routes());

module.exports = router;
