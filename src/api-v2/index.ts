import Router from 'koa-router'
import { getPopularBrands } from './get-popular-brands'
import { getProducts } from './get-products'


const route = new Router({ prefix: '/api/v2' })

route.use('/popular-brands', getPopularBrands.routes())
route.use('/products', getProducts.routes())

export { route as routerApiV2 }
