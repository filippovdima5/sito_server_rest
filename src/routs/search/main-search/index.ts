import LRU from 'lru'
import { RouterContext } from 'koa-router'
import { recordToCacheKey } from '../../../helpers/record-to-cache-key'
import { translRusToLatin } from '../../../libs'
import { Products } from '../../../schemas/products'
import { queryNormalization } from '../../../helpers/query-normalization'
import { createCache } from '../../../helpers/create-cache'


type ReqParams = {
  sex_id: 1 | 2 | 0,
  phrase: string,
}

const requiredFields: Array<keyof ReqParams> = ['phrase', 'sex_id']


const mainSearchLRU = new LRU<any>({ max: 10, maxAge: 60 * 1000 })
const cacheRender = createCache(mainSearchLRU)


async function renderMainSearch({ sex_id, phrase }: ReqParams ): Promise<any> {
  const sexQuery = (sex_id === 0) ? [0, 1, 2] : [0, sex_id]
  
  
  const phraseQuery: Array<any> = [phrase, translRusToLatin(phrase)]
    .map(item => (new RegExp(item, 'i')))
  
  
  
  return await Products.aggregate([
    { $match: { sex_id: { $in: sexQuery } } },
    { $facet: {
      // Пока бренды
      brands: [
        { $match: { brand: { $in: phraseQuery } } },
        { $group: { _id: '$brand', count: { $sum: 1 } } },
        { $project: { title : '$_id', count : '$count', type: 'brand', _id: 0 } },
      ]
    } },
  ])
    .then(res => [...res[0].brands])
}


export async function mainSearch(ctx: RouterContext) {
  const finalParams = queryNormalization(ctx.request.body as ReqParams, {}, requiredFields)
  
  const cacheKey = recordToCacheKey(finalParams)
  ctx.body = await cacheRender(
    () => renderMainSearch(finalParams),
    cacheKey,
    () => []
  )()
}


