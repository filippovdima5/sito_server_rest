import Router from 'koa-router'
import { getPopularBrands } from './get-popular-brands'
import { getProducts } from './get-products'
import { getFacetFilters } from './get-filters/facet'
import { getBrandFilters } from './get-filters/brands'
import { getSizesFilters } from './get-filters/sizes'
import { getCategoriesFilters } from './get-filters/categories'
import { getBrandsByChar } from './get-brands-by-char'
import { searchBrands } from './search/brands'


const route = new Router({ prefix: '/api/v2' })

route.use('/popular-brands', getPopularBrands.routes())
route.use('/products', getProducts.routes())
route.use('/brands-by-char', getBrandsByChar.routes())

/** FILTERS:*/
route.use('/facet-filters', getFacetFilters.routes())
route.use('/brand-filters', getBrandFilters.routes())
route.use('/sizes-filters', getSizesFilters.routes())
route.use('/categories-filters', getCategoriesFilters.routes())

/** SEARCH: */
route.use('/search-brands', searchBrands.routes())

export { route as routerApiV2 }
