import {queryNormalization} from '../../../helpers/query-normalization'
import LRUCache from 'lru-cache'
import {getCache} from '../../../helpers/get-cache'
import {projectFields} from '../../../helpers/project-fields'


// ------------------------------------------------------------------
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



const lru = new LRUCache({max: 100, maxAge: 60 * 1000})

export async function facetFilters(ctx: any) {
  const finalParams = queryNormalization(ctx.request.body as ReqParams, defaultParams, requiredFields)
  const {} = finalParams

  try {
    ctx.body = getCache(lru, finalParams)
    return null

  } catch (e) {

  }
}


