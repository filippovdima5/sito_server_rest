import Koa from 'koa'
import Router from 'koa-router'
import { getSeo } from './get-seo'


const router = new Router({ prefix: `/api/seo` })

router.post('/', getSeo)

exports.init = (app: Koa) => app.use(router.routes())
