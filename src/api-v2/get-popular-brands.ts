import Router, { RouterContext } from 'koa-router'
import LRU from 'lru'
import { SexId } from '../types'
import { ProdProducts } from '../schemas/prod-products'
import { createCache } from '../helpers/create-cache'


const ONE_HOURS = 1000 * 60 * 60
const route = new Router()

const lru = new LRU<Array<string>>({ max: 6, maxAge: ONE_HOURS })
const getCache = createCache(lru)

route.get('/', async (ctx: RouterContext) => {
  const { sex_id, limit } = ctx.query
  if (!sex_id || !limit) return ctx.throw('Нет данных')
  if (limit > 300) return ctx.throw('А хуй на')
  
  ctx.body = await getCache(() => getBrands(sex_id, limit), ctx.url)()
})

export { route as getPopularBrands }



async function getBrands(sex_id: SexId, limit: number): Promise<Array<string>> {
  return ProdProducts.aggregate([
    { $match: { sex_id: Number(sex_id) } },
    { $group: { _id: '$brand', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: Number(limit) },
    { $group: {   _id: 'null', brands: { $addToSet: '$_id' } } }
  ])
    .then(res => {
      if (!res || !Array.isArray(res)) return [] as Array<string>
      if (!res[0]) return [] as Array<string>
      return  res[0].brands as Array<string>
    })
}
