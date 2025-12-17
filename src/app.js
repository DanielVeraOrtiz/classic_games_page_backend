const koa = require('koa');
const koaLogger = require('koa-logger');
const { koaBody } = require('koa-body');
const router = require('./routes.js');
const orm = require('./models');

// Crear instancia de koa.
const app = new koa();

// Koa permite extender su contexto (ctx). Aquí se expone el ORM
// en ctx.orm para que los routers accedan a los modelos sin
// importarlos directamente. Hoy es Sequelize, pero podría ser otro ORM.
app.context.orm = orm;

// Middlewares proporcionados por koa.
// koa-logger mas logs en consola y koa-body parsea el body de la http request.
app.use(koaLogger());
app.use(koaBody());

// koa-router
app.use(router.routes());

// Middleware personalizado. Encargado de dar respuesta "Hola Mundo".
app.use((ctx, next) => {
	ctx.body = "Hola Mundo";
});

module.exports = app;