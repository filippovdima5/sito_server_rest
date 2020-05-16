import Router, { RouterContext } from 'koa-router'
import LRU from 'lru'
import { SexId } from '../types'
import { ProdProducts } from '../schemas/prod-products'
import { createCache } from '../helpers/create-cache'


const ONE_HOURS = 1000 * 60 * 60
const route = new Router()


// $TODO: Вынести в nginx.
// На короткое время. Очень много разных запросов может быть и должно часто обновляться
const lru = new LRU<any>({ max: 100, maxAge: ONE_HOURS })
const getCache = createCache(lru)


route.get('/', async (ctx: RouterContext) => {

})
