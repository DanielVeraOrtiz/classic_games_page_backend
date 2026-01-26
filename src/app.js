const koa = require('koa');
const koaLogger = require('koa-logger');
const { koaBody } = require('koa-body');
const router = require('./routes.js');
const orm = require('./models');
const cors = require('@koa/cors');

// Crear instancia de koa.
const app = new koa();

// Koa permite extender su contexto (ctx). Aquí se expone el ORM
// en ctx.orm para que los routers accedan a los modelos sin
// importarlos directamente. Hoy es Sequelize, pero podría ser otro ORM.
app.context.orm = orm;

// Cors para poder acceder desde el frontend.
// Se retoco ahora para que no quedara cors(), aqui se define el origen del que consumira y los
// headers que se permiten, tambien se puede configurar las credenciales.
app.use(
  cors({
    origin: 'http://localhost:5173',
    allowHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Middlewares proporcionados por koa.
// koa-logger mas logs en consola y koa-body parsea el body de la http request.
app.use(koaLogger());
app.use(koaBody());

// koa-router
app.use(router.routes());

// Middleware personalizado. Encargado de dar respuesta "Hola Mundo".
app.use((ctx, next) => {
  ctx.body = 'Hola Mundo';
});

module.exports = app;
