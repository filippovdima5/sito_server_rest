import Router, { RouterContext } from 'koa-router'
import LRU from 'lru'
import { createCache } from '../../helpers/create-cache'
import { customQueryParse } from '../../libs/custom-query-parse'
import { SexId } from '../../types'
import { unisexCategoryKeys } from '../../constants'
import { setRangeQuery } from '../../libs/get-query'
import { translRusToLatin } from '../../libs'
import { Products } from '../../schemas/v2/products'
import { LIMIT_FILTER_ITEMS, lruConfig } from './constants'


export type ParamsBrandsFilters = {
  sex_id: SexId,
  price_from?: number,
  price_to?: number,
  sale_from?: number,
  sale_to?: number,
  
  categories?: Array<keyof typeof unisexCategoryKeys>,
  sizes?: Array<string>,
  
  brand_search?: string,
  brand_all?: boolean,
  
  not_size?: boolean,
}


const route = new Router()
const lru = new LRU<any>(lruConfig)
export const getCacheBrandsFilters = createCache(lru)


// region route:
route.get('/', async (ctx: RouterContext) => {
  const { sex_id, sale_to, categories, sizes, price_from, price_to, sale_from, brand_search, brand_all, not_size } = customQueryParse(ctx.search)
  if ( !sex_id ) return ctx.throw('Не все параметры')
  
  const params: ParamsBrandsFilters = { brand_search, sizes, categories, sale_from, price_to, price_from, sex_id, sale_to, brand_all, not_size }
  ctx.body = await getCacheBrandsFilters(
    () => getBrands(params),
    JSON.stringify(params),
    (error) => { console.error(error); return [] }
  )()
})
export { route as getBrandFilters }
// endregion



// region method
export async function getBrands(params: ParamsBrandsFilters) {
  const query: any = { sex_id: params.sex_id }
  setRangeQuery(params, query)
  

  
  if (params.categories && params.categories.length > 0) query['category_id'] = { $in: params.categories }
  
  let sizeSearchArr: Array<any> = []
  if ((params.sizes && params.sizes.length > 0) || (params.not_size)) {
    if (params.sizes && params.sizes.length > 0) sizeSearchArr = params.sizes
    if (params.not_size) { sizeSearchArr.push([]) }
    query['sizes'] = { $in: sizeSearchArr }
  }
  
  if (params.brand_search) {
    const phraseQuery: Array<any> = [params.brand_search, translRusToLatin(params.brand_search)]
      .map(item => (new RegExp(item, 'i')))
  
    query['brand'] = { $in: phraseQuery }
    
  }
  
  return Products.aggregate(genAggregate(query, params.brand_all))
    .then(res => {
      if (!res) return []
      if (!res[0]) return []
      if (!res[0].arr) return []
      return res[0].arr
    })
}

function genAggregate(query: any, showAll?: boolean): Array<any> {
  if (showAll) return [
    { $match: query },
    { $group: { _id: '$brand'  } },
    { $group: {   _id: 'null', arr: { $addToSet: '$_id' } } }
  ]
  return [
    { $match: query },
    { $group: { _id: '$brand', count: { $sum: 1  }  } },
    { $sort: { count: -1 } },
    { $limit:  LIMIT_FILTER_ITEMS  },
    { $group: {   _id: 'null', arr: { $addToSet: '$_id' } } }
  ]
}
// endregion
