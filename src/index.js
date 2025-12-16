import koa from 'koa';
import { koaBody } from 'koa-body';
import KoaLogger from 'koa-logger';

const app = new koa();

app.use(KoaLogger());
app.use(koaBody());

app.use((ctx, next) => {
    ctx.body = "Hola Mundo";
});

app.listen(3000, () => {
    console.log("Iniciando app. Escuchando en el puerto 3000");
});