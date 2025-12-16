import Router from "koa-router";

const router = new Router()

const characters = [
    {
        "name": "Bart Simpson",
        "age": 12,
        "description": "Ni idea"
    }
];

router.get('characters.show', '/show', async (ctx) => {
    ctx.body = characters;
})

export default router;