import Koa from 'koa'
import Router from 'koa-router'
import { userGet } from './user-get'
import { userSet } from './user-set'


const router = new Router({prefix: `/api/user`})

router.get('/', userGet)
router.post('/', userSet)

exports.init = (app: Koa) => app.use(router.routes())