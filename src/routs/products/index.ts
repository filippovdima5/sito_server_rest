import Koa from 'koa'
import Router from 'koa-router'
import { productsList } from './products-list'
import { facetFilters } from './facet-filters'


const router = new Router({prefix: `/api/products`})

router.post('/products-list', productsList)
router.post('/facet-filters', facetFilters)

exports.init = (app: Koa) => app.use(router.routes())