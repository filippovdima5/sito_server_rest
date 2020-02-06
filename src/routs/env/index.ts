import Koa from 'koa'
import Router from 'koa-router'
import {mainEnv} from './main'


const router = new Router({prefix: `/api/env`})

// @ts-ignore
router.get('/main', mainEnv)

exports.init = (app: Koa) => app.use(router.routes())