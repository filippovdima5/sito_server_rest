import fs from 'fs'
import Router from 'koa-router'
import path from 'path'


const router = new Router()

router.get("/", async (ctx, next) => {
  ctx.body = { msg: "Hello world!" }

  await next();
});

router.get('*', async function (ctx) {
  console.log('fdf')
  ctx.type = 'text/html; charset=utf-8';
  ctx.body = fs.readFileSync('./public/index.html')
})

exports.init = (app: any) => app.use(router.routes())