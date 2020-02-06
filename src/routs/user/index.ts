import Koa from 'koa'
import Router from 'koa-router'
import { userPost } from './user-post'


const router = new Router({prefix: `/api/user`})

// @ts-ignore
router.post('/', userPost)

exports.init = (app: Koa) => app.use(router.routes())