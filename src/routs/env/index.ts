import Koa from 'koa'
import Router from 'koa-router'
import {mainEnv} from './main'
import {genderInfo} from './gender'


const router = new Router({prefix: `/api/env`})

// @ts-ignore
router.get('/main', mainEnv)
// @ts-ignore
router.get('/gender', genderInfo)

exports.init = (app: Koa) => app.use(router.routes())