import Router from 'koa-router'
import { getPopularBrands } from './get-popular-brands'


const route = new Router({ prefix: '/api/v2' })

route.use('/popular-brands', getPopularBrands.routes())

export { route as routerApiV2 }
