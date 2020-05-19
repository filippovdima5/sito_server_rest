import Router, { RouterContext } from 'koa-router'
import LRU from 'lru'
import { createCache } from '../../helpers/create-cache'
import { customQueryParse } from '../../libs/custom-query-parse'
import { SexId } from '../../types'
import { unisexCategoryKeys } from '../../constants'
import { setRangeQuery } from '../../libs/get-query'
import { ProdProducts } from '../../schemas/prod-products'
import { lruConfig } from './constants'


export type ParamsSizesFilters = {
  sex_id: SexId,
  price_from?: number,
  price_to?: number,
  sale_from?: number,
  sale_to?: number,
  
  categories?: Array<keyof typeof unisexCategoryKeys>,
  brands?: Array<string>,
}


const route = new Router()
const lru = new LRU<any>(lruConfig)
export const getCacheSizeFilters = createCache(lru)



// region route:
route.get('/', async (ctx: RouterContext) => {
  const { sex_id, sale_to, categories, brands, price_from, price_to, sale_from } = customQueryParse(ctx.search)
  if ( !sex_id ) return ctx.throw('Не все параметры')
  
  const params: ParamsSizesFilters = { sale_to, sex_id, price_from, price_to, sale_from, categories, brands }
  ctx.body = await getCacheSizeFilters(
    () => getSizes(params),
    JSON.stringify(params),
    (error) => { console.error(error); return [] }
  )()
  
})
export { route as getSizesFilters }
// endregion



// region method
export async function getSizes(params: ParamsSizesFilters) {
  const query: any = { sex_id: params.sex_id }
  setRangeQuery(params, query)
  
  if (params.categories && params.categories.length > 0) query['category_id'] = { $in: params.categories }
  if (params.brands && params.brands.length > 0) query['brand'] = { $in: params.brands }
  
  
  return ProdProducts.aggregate(genAggregate(query))
    .then(res => {
      if (!res) return []
      if (!res[0]) return []
      if (!res[0].arr) return []
      return res[0].arr
    })
}


function genAggregate(query: any): Array<any> {
  return [
    { $match: query },
    { $unwind: { path: '$sizes' } },
    { $project: { sizes: true } },
    { $group: { _id: '$sizes' } },
    { $group: {   _id: 'null', arr: { $addToSet: '$_id' } } }
  ]
}
// endregion
