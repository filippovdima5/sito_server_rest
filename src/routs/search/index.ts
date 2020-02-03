import Koa from 'koa'
import Router from 'koa-router'
import { mainSearch } from './main-search'


const router = new Router({prefix: `/api/search`})

router.post('/main-search', mainSearch)

exports.init = (app: Koa) => app.use(router.routes())