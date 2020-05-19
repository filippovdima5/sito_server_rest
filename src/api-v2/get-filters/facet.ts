import Router, { RouterContext } from 'koa-router'
import LRU from 'lru'
import { SexId } from '../../types'
import { createCache } from '../../helpers/create-cache'
import { customQueryParse } from '../../libs/custom-query-parse'
import { unisexCategoryKeys } from '../../constants'
import { lruConfig } from './constants'
import { ParamsBrandsFilters, getBrands, getCacheBrandsFilters } from './brands'
import { ParamsSizesFilters, getSizes, getCacheSizeFilters } from './sizes'
import { ParamsCategoriesFilters, getCategories, getCacheCategories } from './categories'


type Params = {
  sex_id: SexId,
  price_from?: number,
  price_to?: number,
  sale_from?: number,
  sale_to?: number,
  
  categories?: Array<keyof typeof unisexCategoryKeys>,
  brands?: Array<string>,
  sizes?: Array<string>,
  
  size_search?: string,
  size_all?: boolean,
  brand_search?: string,
  brand_all?: boolean,
}


// $TODO: Вынести в nginx.
const lru = new LRU<any>(lruConfig)
const getCache = createCache(lru)
const emptyResponse = {
  categories: [],
  brands: [],
  sizes: []
}

const route = new Router()

// region route:
route.get('/', async (ctx: RouterContext) => {
  const {
    sex_id, sale_to, categories, brands, sizes, price_from, price_to, sale_from, brand_all, brand_search
  } = customQueryParse(ctx.search)
  
  if ( !sex_id ) return ctx.throw('Не все параметры')
  
  
  ctx.body = await getCache(
    () => getFacetFilters({
      sale_to, sex_id, price_from, price_to, sale_from, categories, brands, sizes, brand_all, brand_search
    }),
    ctx.url,
    () => emptyResponse
  )()
})

export { route as getFacetFilters }
// endregion


// region method:
async function getFacetFilters({
  brand_search, brand_all,  brands, categories, sale_from, price_to, price_from, sex_id, sale_to, sizes
}: Params) {
  const categoryParams: ParamsCategoriesFilters = { brands, price_from, price_to, sale_from, sale_to, sex_id, sizes }
  const sizeParams: ParamsSizesFilters = {  brands, categories, price_from, price_to, sale_from, sale_to, sex_id }
  const brandParams: ParamsBrandsFilters = { brand_all, brand_search, categories, price_from, price_to, sale_from, sale_to, sex_id, sizes }
  
  return Promise.all([
    getCacheCategories(() => getCategories(categoryParams), JSON.stringify(categoryParams), () => [])(),
    getCacheBrandsFilters(() => getBrands(brandParams), JSON.stringify(brandParams), () => [])(),
    getCacheSizeFilters(() => getSizes(sizeParams), JSON.stringify(sizeParams), () => [])()
  ])
    .then(([categories, brands, sizes]) => ({ categories, brands, sizes }))
}
// endregion
