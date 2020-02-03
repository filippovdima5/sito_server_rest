import LRUCache from 'lru-cache'
import { getCache } from '../../../helpers/get-cache'
import { translRusToLatin } from './helpers/translit-rus-to-latin'
import { Products } from '../../../schemas/products'
import { queryNormalization } from '../../../helpers/query-normalization'

// ------------------------------------------------------------------
type ReqParams = {
  sex_id: 1 | 2 | 0,
  phrase: string,
}

const requiredFields: Array<keyof ReqParams> = ['phrase', 'sex_id']


// ------------------------------------------------------------------

const lru = new LRUCache({max: 100, maxAge: 20 * 1000})

export async function mainSearch(ctx: any) {
  const finalParams = queryNormalization(ctx.request.body as ReqParams, {}, requiredFields)
  const {sex_id, phrase} = finalParams

  const sexQuery = (sex_id === 0) ? [0, 1, 2] : [0, sex_id]
  const phraseQuery: Array<any> = [phrase, translRusToLatin(phrase)]
    .map(item => (new RegExp(item, 'i')))



  try {
    ctx.body = getCache(lru, finalParams)
    return null

  } catch (e) {
    return await Products.aggregate([
      {$match: {sex_id: {$in: sexQuery}}},
      {$facet: {
        // Пока бренды
        brands: [
          {$match: {brand: {$in: phraseQuery}}},
          {$group: {_id: "$brand", count: {$sum: 1}}},
          {$project: { title : "$_id", count : "$count", type: 'brand', _id: 0}},
        ]
        }},
    ])
      .then(res => {
        // todo: Научится делать это в aggregации
        return [...res[0].brands]
      })
      .then(res => {
        ctx.body = res
        lru.set(JSON.stringify(finalParams), res)
      })
  }
}


