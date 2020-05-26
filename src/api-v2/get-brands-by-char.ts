import Router, { RouterContext } from 'koa-router'
import LRU from 'lru'
import { Products } from '../schemas/v2/products'
import { createCache } from '../helpers/create-cache'
import { translRusToLatin } from '../libs'



const TWO_HOURS = 1000 * 60 * 60 * 2
const route = new Router()

// $TODO: Вынести в nginx:
const lru = new LRU<Array<any>>({ max: 100, maxAge: TWO_HOURS })
const getCache = createCache(lru)

// region
route.get('/', async (ctx: RouterContext) => {
  const { sex_id, phrase } = ctx.query
  
  if (!sex_id ) return ctx.throw('Нет данных')
  if (phrase) {if (phrase.toString().length > 20) return ctx.throw('Хуй')}
  
  ctx.body = await getCache(
    () => getBrandsByChar(Number(sex_id), phrase),
    ctx.url
  )()
})
export { route as getBrandsByChar }
// endregion


async function getBrandsByChar(sex_id: number, phrase?: string): Promise<any> {
  const query: any = { sex_id }
  if (phrase) query['brand'] = {
    $in: [phrase, translRusToLatin(phrase)].map(item => (new RegExp(item, 'i')))
  }

  
  return Products.aggregate([
    { $match: query },
    { $sort: { brand: -1 } },
    { $project: { char: { $toUpper: '$brand' }, brand: '$brand'  } },
    { $group: { _id: { $substrCP: ['$char', 0, 1] }, brands: { $addToSet: '$brand' } } },
    { $project: {   char: '$_id', brands: '$brands', _id: 0 } }
  ])
    .then(res => {
      if (!res || !Array.isArray(res)) return []
      return  res
    })
}
