import Router, { RouterContext } from 'koa-router'
import LRU from 'lru'
import { SexId } from '../../types'
import { ProdProducts } from '../../schemas/prod-products'
import { createCache } from '../../helpers/create-cache'
import { customQueryParse } from '../../libs/custom-query-parse'
import { unisexCategoryKeys } from '../../constants'
import { setRangeQuery } from '../../libs/get-query'


const FIVE_MINUTES = 1000 * 60 * 5
const route = new Router()


// $TODO: Вынести в nginx.
// На короткое время. Очень много разных запросов может быть и должно часто обновляться
// region route:
const lru = new LRU<any>({ max: 200, maxAge: FIVE_MINUTES })
const LIMIT = 5
const getCache = createCache(lru)
const emptyResponse = {
  categories: [],
  brands: [],
  sizes: []
}



route.get('/', async (ctx: RouterContext) => {
  const { sex_id, sale_to, categories, brands, sizes, price_from, price_to, sale_from } = customQueryParse(ctx.search)
  if ( !sex_id ) return ctx.throw('Не все параметры')
  
  ctx.body = await getCache(
    () => getFacetFilters({ sale_to, sex_id, price_from, price_to, sale_from, categories, brands, sizes }),
    ctx.url
  )()
  
})
export { route as getFacetFilters }
// endregion


// region method:
type Params = {
  sex_id: SexId,
  price_from?: number,
  price_to?: number,
  sale_from?: number,
  sale_to?: number,
  
  categories?: Array<keyof typeof unisexCategoryKeys>,
  brands?: Array<string>,
  sizes?: Array<string>,
}


async function getFacetFilters(params: Params) {
  const query: any = { sex_id: params.sex_id }
  setRangeQuery(params, query)
  
  const storeQuery: any = {}
  if (params.categories && params.categories.length > 0) storeQuery['category_id'] = { $in: params.categories }
  if (params.brands && params.brands.length > 0) storeQuery['brand'] = { $in: params.brands }
  if (params.sizes && params.sizes.length > 0) storeQuery['sizes'] = { $in: params.sizes }
  
  
  return ProdProducts.aggregate([
    { $match: query },
    { $facet: {
      categories: [
        // { $match: { brands: storeQuery['brands'], sizes: storeQuery['sizes'] } },
        { $group: { _id: '$category_id'  } },
        { $limit: LIMIT },
        { $group: {   _id: 'null', arr: { $addToSet: '$_id' } } }
      ],
      brands: [
        // { $match: { category_id: storeQuery['category_id'], sizes: storeQuery['sizes'] } },
        { $group: { _id: '$brand'  } },
        { $limit: LIMIT },
        { $group: {   _id: 'null', arr: { $addToSet: '$_id' } } }
      ],
      sizes: [
        // { $match: { brands: storeQuery['brands'], category_id: storeQuery['category_id'] } },
        { $unwind: { path: '$sizes' } },
        { $project: { sizes: true } },
        { $group: { _id: '$sizes' } },
        { $limit: LIMIT },
        { $group: {   _id: 'null', arr: { $addToSet: '$_id' } } }
      ]
    } }
  ])
    .then(res => {
      if (!res) return emptyResponse
      if (!res[0]) return emptyResponse
      
      return res[0]
    })
}
// endregion
