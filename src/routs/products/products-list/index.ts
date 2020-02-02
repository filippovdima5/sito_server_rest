import { queryNormalization } from '../../../helpers/query-normalization'
import { Products, ProductsInterface } from '../../../schemas/products'
import LRUCache from 'lru-cache'
import { getCache } from '../../../helpers/get-cache'
import { projectFields } from '../../../helpers/project-fields'
import { setSort } from './helpers/set-sort'


// ------------------------------------------------------------------
export type Sort = 'update_up' | 'price_up' | 'sale_up'

type ReqParams = {
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

  page: number,
  sort: Sort,
  limit: number,
}

const requiredFields: Array<keyof ReqParams> = ['sex_id']

const defaultParams: any = {
  page: 1,
  sort: 'update_up',
  limit: 20,
  price_from: 0,
  price_to: 30000,
  sale_from: 30,
  sale_to: 99,
  favorite: 0
}
// ------------------------------------------------------------------


// ------------------------------------------------------------------
// todo: Типтзировать!
type Query = {
  sex_id: any,
  price: {$gte: ReqParams['price_from'], $lte: ReqParams['price_to']},
  sale: {$gte: ReqParams['sale_from'], $lte: ReqParams['sale_to']},
  brands?: {$in: ReqParams['brands']},
  categories?: {$in: ReqParams['categories']},
  sizes?: {$in: ReqParams['sizes']},
  colors?: {$in: ReqParams['colors']},
}

const responseField: Array<keyof ProductsInterface> = ['id', 'title', 'url', 'img', 'brand', 'price', 'oldprice', 'sale']

// ------------------------------------------------------------------


const lru = new LRUCache({max: 100, maxAge: 60 * 1000})

export async function productsList(ctx: any) {
  const finalParams = queryNormalization(ctx.request.body as ReqParams, defaultParams, requiredFields)
  const {sex_id, brands, categories, colors, limit, page, sizes, sort, price_from, price_to, sale_from, sale_to} = finalParams

  try {
    ctx.body = getCache(lru, finalParams)
    return null

  } catch (e) {

    const $skip = (page - 1) * limit
    const $sort = setSort(sort)


    // todo: Типтзировать операторы mongoDB
    const query: Query = {
      sex_id: {$in: [0, sex_id]},
      price: {$gte: price_from, $lte: price_to},
      sale: {$gte: sale_from, $lte: sale_to},
    }
    if (brands) {
      query.brands = {$in: brands}
    }
    if (categories) {
      query.categories = {$in: categories}
    }
    if (colors) {
      query.colors = {$in: colors}
    }
    if (sizes) {
      query.sizes = {$in: sizes}
    }

    const paginate_info = [
      {$group: {_id: null, count: {$sum: 1}}},
      {
        $project: {
          _id: 0,
          total: "$count",
          total_pages: {$ceil: {$divide: ["$count", limit]}},
        }
      }
    ];


    return await Products
      .aggregate([
        {$match: query},
        {
          $facet: {
            products: [
              {$sort},
              {$skip},
              {$limit: limit},
              {$project: projectFields(responseField)}
            ],
            info: paginate_info
          }
        }
      ])
      .then(res => {
        if (res[0].products.length === 0) {
          ctx.body = {products: [], info: {total: 0, total_pages: 0}}
          lru.set(JSON.stringify(finalParams), {products: [], info: {total: 0, total_pages: 0}})
          return null
        }

        ctx.body = res[0]
        lru.set(JSON.stringify(finalParams), res[0])
      })

  }
}


