const Router = require('koa-router');
const characters = require('./routes/characters.js');
const users = require('./routes/users.js');

// Se define el router de koa y que use las rutas definidas para cada modelo
// que al final logran mapear el path de la request a un trozo de codigo con el comportamiento
// especifico buscado.
const router = new Router();
router.use('/characters', characters.routes());
router.use('/users', users.routes());



module.exports = router;