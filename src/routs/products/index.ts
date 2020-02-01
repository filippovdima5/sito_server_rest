import Koa from 'koa'
import Router from 'koa-router'
import { index } from './products-list'


const router = new Router({prefix: `/api/products`})

router.post('/products-list', index)

exports.init = (app: Koa) => app.use(router.routes())