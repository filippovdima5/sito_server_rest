import Koa from 'koa'
import Router from 'koa-router'


const router = new Router({prefix: `/api/products`})



exports.init = (app: Koa) => app.use(router.routes())