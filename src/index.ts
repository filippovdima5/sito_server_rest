import Koa from "koa"
import Router from "koa-router"
import config from 'config'

import logger from "koa-logger"


const app = new Koa()
const router = new Router()

// Hello world
router.get("/", async (ctx, next) => {
  ctx.body = { msg: "Hello world!" }

  await next()
})

// Middlewares
app.use(logger())

// Routes
app.use(router.routes()).use(router.allowedMethods())

app.listen(config.get('server.port'), () => {
  console.log(`SITO_REST_SERVER started at port : ${config.get('server.port')});
});


