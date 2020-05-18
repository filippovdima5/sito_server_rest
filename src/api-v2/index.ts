import Router from 'koa-router'
import { getPopularBrands } from './get-popular-brands'
import { getProducts } from './get-products'
import { getFacetFilters } from './get-filters/facet'


const route = new Router({ prefix: '/api/v2' })

route.use('/popular-brands', getPopularBrands.routes())
route.use('/products', getProducts.routes())
route.use('/facet-filters', getFacetFilters.routes())

export { route as routerApiV2 }
