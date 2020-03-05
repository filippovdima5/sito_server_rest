import Koa from 'koa'
import Router from 'koa-router'
import  { allBrands } from './all-brands'


const router = new Router({prefix: `/api/simple`})

router.get('/all-brands', allBrands)

exports.init = (app: Koa) => app.use(router.routes())