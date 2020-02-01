import Koa from 'koa'
import Router from 'koa-router'
import { productsList } from './products-list'


const router = new Router({prefix: `/api/products`})

router.post('/products-list', productsList)

exports.init = (app: Koa) => app.use(router.routes())