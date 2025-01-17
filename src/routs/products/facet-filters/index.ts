import LRU from 'lru'
import { RouterContext } from 'koa-router'
import { queryNormalization } from '../../../helpers/query-normalization'
import { Products } from '../../../schemas/products'
import { objectWithoutFields } from '../../../helpers/object-without-fields'
import { recordToCacheKey } from '../../../helpers/record-to-cache-key'
import { createCache } from '../../../helpers/create-cache'
import { compareResults } from './helpers/compare-results'
import { setFacetItem, setFacetArrow } from './helpers/set-facet'


// ------------------------------------------------------------------
export type ReqParams = {
  sex_id: 1 | 2,

  brands: Array<string> | null,
  categories: Array<number> | null,
  sizes: Array<string> | null,
  colors: Array<string> | null,

  price_from: number,
  price_to: number,
  sale_from: number,
  sale_to: number,

  favorite: 0 | 1,
}

const requiredFields: Array<keyof ReqParams> = ['sex_id']

const defaultParams: any = {
  price_from: 0,
  price_to: 30000,
  sale_from: 30,
  sale_to: 99,

  favorite: 0
}
// ------------------------------------------------------------------

// ------------------------------------------------------------------
type Query = {
  sex_id: any,
  price: {$gte: ReqParams['price_from'], $lte: ReqParams['price_to']},
  sale: {$gte: ReqParams['sale_from'], $lte: ReqParams['sale_to']},
  brand?: {$in: ReqParams['brands']},
  category_id?: {$in: ReqParams['categories']},
  sizes?: {$in: ReqParams['sizes']},
  color?: {$in: ReqParams['colors']},
}
// ------------------------------------------------------------------



async function renderFiltersWithoutParams({ sexId }: { sexId: 1 | 2 }): Promise<any> {
  return await Products
    .aggregate([
      { $match: { sex_id: { $in: [0, sexId] } } },
      { $facet: {
        categories: setFacetItem('category_id'),
        brands: setFacetItem('brand'),
        sizes: setFacetArrow('sizes'),
        colors: setFacetArrow('color'),
      } }
    ])
    .then(res => res[0])
}


async function renderFiltersWithParams(finalParams: ReqParams, firstRes: any): Promise<any> {
  const { sex_id, brands, categories, sizes, colors, price_from, price_to, sale_from, sale_to } = finalParams
  
  const query: Query = {
    sex_id: { $in: [0, sex_id] },
    price: { $gte: price_from, $lte: price_to },
    sale: { $gte: sale_from, $lte: sale_to },
  }
  if (brands) query.brand = { $in: brands }
  if (categories) query.category_id = { $in: categories }
  if (colors) query.color = { $in: colors }
  if (sizes) query.sizes = { $in: sizes }
  
  
  const nextRes = await Promise.all([
    Products.find(objectWithoutFields(query, ['category_id'])).distinct('category_id'),
    Products.find(objectWithoutFields(query, ['brand'])).distinct('brand'),
    Products.find(objectWithoutFields(query, ['sizes'])).distinct('sizes'),
    Products.find(objectWithoutFields(query, ['color'])).distinct('color'),
    Products.find(objectWithoutFields(query, ['price'])).sort({ price: 1 }).limit(1),
    Products.find(objectWithoutFields(query, ['price'])).sort({ price: -1 }).limit(1),
    Products.find(objectWithoutFields(query, ['sale'])).sort({ sale: 1 }).limit(1),
    Products.find(objectWithoutFields(query, ['sale'])).sort({ sale: -1 }).limit(1),
  ])
    .then(res => ({
      categories: res[0],
      brands: res[1],
      sizes: res[2],
      colors: res[3],
      price_from: res[4][0] ? res[4][0].price : defaultParams.price_from,
      price_to: res[5][0] ? res[5][0].price : defaultParams.price_to,
      sale_from: res[6][0] ? res[6][0].sale : defaultParams.sale_from,
      sale_to: res[7][0] ? res[7][0].sale : defaultParams.sale_to
    }))
  
  return ({
    categories: compareResults(firstRes.categories, nextRes.categories),
    brands: compareResults(firstRes.brands, nextRes.brands),
    sizes: compareResults(firstRes.sizes, nextRes.sizes),
    colors: compareResults(firstRes.colors, nextRes.colors),
    price_from: nextRes.price_from,
    price_to: nextRes.price_to,
    sale_from: nextRes.sale_from,
    sale_to: nextRes.sale_to,
  })
}


const withoutParamsLRU = new LRU<any>({ max: 10, maxAge: 3 * 60 * 1000 })
const cacheRenderOut = createCache(withoutParamsLRU)

const withParamsLRU = new LRU<any>({ max: 10, maxAge: 2 * 60 * 1000 })
const cacheRenderWith = createCache(withParamsLRU)


export async function facetFilters(ctx: RouterContext) {
  const finalParams = queryNormalization(ctx.request.body as ReqParams, defaultParams, requiredFields)
  
  const cacheKeyWithoutParams = finalParams.sex_id.toString()
  const firstRes = await cacheRenderOut(
    () => renderFiltersWithoutParams({ sexId: finalParams.sex_id }),
    cacheKeyWithoutParams
  )()
  
  
  const cacheKeyWithParams = recordToCacheKey(finalParams)
  ctx.body = await cacheRenderWith(
    () => renderFiltersWithParams(finalParams, firstRes),
    cacheKeyWithParams
  )()
}


