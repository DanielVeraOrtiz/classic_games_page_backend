import koa from 'koa';
import { koaBody } from 'koa-body';
import KoaLogger from 'koa-logger';
import router from './routes.js';
import orm from './models/index.cjs';

// Crear instancia de koa.
const app = new koa();

app.context.orm = orm;

// Middlewares proporcionados por koa.
// koa-logger mas logs en consola y koa-body parsea el body de la http request.
app.use(KoaLogger());
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

export default app;