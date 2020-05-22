import Router, { RouterContext } from 'koa-router'
import LRU from 'lru'
import { SexId } from '../types'
import { Products } from '../schemas/v2/products'
import { createCache } from '../helpers/create-cache'
import { customQueryParse, SortTypes } from '../libs/custom-query-parse'
import { unisexCategoryKeys } from '../constants'
import { setRangeQuery } from '../libs/get-query'


const FIVE_MINUTES = 1000 * 60 * 5
const route = new Router()
const emptyResponse = {
  items: [],
  pagination: {
    totalItems: 0,
    totalPages: 0
  }
}


// $TODO: Вынести в nginx.
// На короткое время. Очень много разных запросов может быть и должно часто обновляться
// region route:
const lru = new LRU<any>({ max: 100, maxAge: FIVE_MINUTES })
const getCache = createCache(lru)


route.get('/', async (ctx: RouterContext) => {
  const { sex_id, limit, sort, page, sale_to, categories, brands, sizes, price_from, price_to, sale_from, not_size } = customQueryParse(ctx.search)
  
  
  if (!sex_id || !limit || !sort || !page) return ctx.throw('Не все параметры')
  if (limit > 50) return ctx.throw('Хуй')
  
  
  ctx.body = await getCache(
    () => getProducts({ limit, sort, sizes, brands, categories, sale_to, sale_from, price_to, price_from, sex_id, page, not_size }),
    ctx.url
  )()
})

export { route as getProducts }
// endregion


// region method:
type Params = {
  sex_id: SexId,
  limit: number,
  sort: SortTypes,
  page: number,
  categories?: Array<keyof typeof unisexCategoryKeys>,
  brands?: Array<string>,
  sizes?: Array<string>,
  price_from?: number,
  price_to?: number,
  sale_from?: number,
  sale_to?: number,
  
  not_size?: boolean,
}

async function getProducts(params: Params) {
  const offset = (params.page - 1) * params.limit
  
  const query: any = { sex_id: params.sex_id }
  setRangeQuery(params, query)

  if (params.categories && params.categories.length > 0) query['category_id'] = { $in: params.categories }
  if (params.brands && params.brands.length > 0) query['brand'] = { $in: params.brands }
  
  let sizeSearchArr: Array<any> = []
  if ((params.sizes && params.sizes.length > 0) || (params.not_size)) {
    if (params.sizes && params.sizes.length > 0) sizeSearchArr = params.sizes
    if (params.not_size) { sizeSearchArr.push([]) }
    query['sizes'] = { $in: sizeSearchArr }
  }
  
  return Products.aggregate([
    { $match: query },
    { $facet: {
      items: [
        { $sort: params.sort },
        { $skip: offset },
        { $limit: params.limit },
        { $project: {
          id: '$_id',
          _id: 0,
          title: '$title',
          brand: '$brand',
          sexId: '$sex_id',
          categoryId: '$category_id',
          sizes: '$sizes',
          colors: '$colors',
          images: '$img',
          price: '$price',
          oldPrice: '$oldprice',
          sale: '$sale',
        } }
      ],
      pagination: [
        { $group: { _id: null, count: { $sum: 1 } } },
        {
          $project: {
            _id: 0,
            totalItems: '$count',
            totalPages: { $ceil: { $divide: ['$count', params.limit] } },
          }
        }
      ]
    } }
  ])
    .then(res => {
      if (!res || res.length === 0) return emptyResponse
      // @ts-ignore
      if (!res[0].pagination || res[0].pagination.length === 0) return emptyResponse
      return { ...res[0], pagination: res[0].pagination[0] }
    })
  
}
// endregion
