import Router, { RouterContext } from 'koa-router'
import LRU from 'lru'
import { Products } from '../../schemas/v2/products'
import { createCache } from '../../helpers/create-cache'
import { translRusToLatin } from '../../libs'



const TWO_HOURS = 1000 * 60 * 60 * 2
const defaultLimit = 50
const route = new Router()


// $TODO: Вынести в nginx:
const lru = new LRU<Array<any>>({ max: 100, maxAge: TWO_HOURS })
const getCache = createCache(lru)


// region
route.get('/', async (ctx: RouterContext) => {
  const { sex_id, phrase, limit } = ctx.query
  
  ctx.body = await getCache(
    () => searchBrands({ sex_id: Number(sex_id), phrase, limit: Number(limit) }),
    ctx.url
  )()
  
})
export { route as searchBrands }
// endregion


async function searchBrands({ sex_id, phrase, limit }: { sex_id?: number, phrase?: string, limit?: number }) {
  const query: any = {}
  
  if (sex_id) query['sex_id'] = sex_id
  if (phrase) query['brand'] = {
    $in: [phrase, translRusToLatin(phrase)].map(item => (new RegExp(item, 'i')))
  }
  
  return Products.aggregate([
    { $match: query },
    { $sort: { brand: -1 } },
    { $group: { _id: '$brand', count: { $sum: 1 } } },
    { $limit: (limit && limit > 0) ? limit : defaultLimit },
    { $project: {   title: '$_id', count: '$count', type: 'brand', _id: 0 } }
  ])
    .then(res => {
      if (!res || !Array.isArray(res)) return []
      return  res
    })
}
