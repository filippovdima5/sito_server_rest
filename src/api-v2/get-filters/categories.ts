import Router, { RouterContext } from 'koa-router'
import LRU from 'lru'
import { SexId } from '../../types'
import { Products } from '../../schemas/v2/products'
import { createCache } from '../../helpers/create-cache'
import { customQueryParse } from '../../libs/custom-query-parse'
import { setRangeQuery } from '../../libs/get-query'
import { lruConfig } from './constants'


export type ParamsCategoriesFilters = {
  sex_id: SexId,
  price_from?: number,
  price_to?: number,
  sale_from?: number,
  sale_to?: number,
  
  brands?: Array<string>,
  sizes?: Array<string>,
  
  not_size?: boolean,
}


const route = new Router()
const lru = new LRU<any>(lruConfig)
export const getCacheCategories = createCache(lru)



// region route:
route.get('/', async (ctx: RouterContext) => {
  const { sex_id, sale_to, brands, sizes, price_from, price_to, sale_from, not_size } = customQueryParse(ctx.search)
  if ( !sex_id ) return ctx.throw('Не все параметры')
  
  const params: ParamsCategoriesFilters = { sex_id, sale_to, brands, sizes, price_from, price_to, sale_from, not_size }
  ctx.body = await getCacheCategories(
    () => getCategories(params),
    JSON.stringify(params),
    (error) => { console.error(error); return [] }
  )()
})
export { route as getCategoriesFilters }
// endregion



// region method
export async function getCategories(params: ParamsCategoriesFilters) {
  const query: any = { sex_id: params.sex_id }
  setRangeQuery(params, query)
  
  if (params.brands && params.brands.length > 0) query['brand'] = { $in: params.brands }
  
  let sizeSearchArr: Array<any> = []
  if ((params.sizes && params.sizes.length > 0) || (params.not_size)) {
    if (params.sizes && params.sizes.length > 0) sizeSearchArr = params.sizes
    if (params.not_size) { sizeSearchArr.push([]) }
    query['sizes'] = { $in: sizeSearchArr }
  }
  

  
  return Products.aggregate([
    { $match: query },
    { $group: { _id: '$category_id'  } },
    { $group: {   _id: 'null', arr: { $addToSet: '$_id' } } }
  ])
    .then(res => {
      if (!res) return []
      if (!res[0]) return []
      if (!res[0].arr) return []
      return res[0].arr
    })
}
// endregion

