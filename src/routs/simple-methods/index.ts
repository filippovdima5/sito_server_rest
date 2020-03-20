import Koa from 'koa'
import Router from 'koa-router'
import  { allBrands } from './all-brands'
import { popularBrands } from './popular-brands'

const router = new Router({prefix: `/api/simple`})

router.get('/all-brands', allBrands)
router.get('/popular-brands', popularBrands)

exports.init = (app: Koa) => app.use(router.routes())
