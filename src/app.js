const koa = require('koa');
const koaLogger = require('koa-logger');
const { koaBody } = require('koa-body');
const router = require('./routes.js');
const orm = require('./models');

// Crear instancia de koa.
const app = new koa();

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

// Hace que el servidor escuche en el puerto 3000.
// app.listen(3000, () => {
// 	console.log("Iniciando app. Escuchando en el puerto 3000");
// });

module.exports = app;