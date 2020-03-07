import Koa from 'koa'
import Router from 'koa-router'
import { productsList } from './products-list'
import { facetFilters } from './facet-filters'
import { getLikes } from './likes'


const router = new Router({prefix: `/api/products`})

router.post('/products-list', productsList)
router.post('/facet-filters', facetFilters)
router.post('/like-products', getLikes)

exports.init = (app: Koa) => app.use(router.routes())