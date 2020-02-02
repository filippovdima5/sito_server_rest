import { Products } from '../../../schemas/products'
import LRUCache from 'lru-cache'
import { getCache } from '../../../helpers/get-cache'
import { ReqParams } from './index'


const setFacetItem = (group: string) => ([
  {$group: {_id: `${group}`, count: {$sum: 1}}},
  {$project: {value: "$_id", count: "$count", _id: 0}},
  {sort: {count: 1}}
])



const lru = new LRUCache({ max: 100, maxAge: 3 * 60 * 1000 })

export async function onlySex(sex_id: ReqParams['sex_id']) {
  try {
    return getCache(lru, sex_id)
  } catch (e) {
    return await Products
      .aggregate([
        {$match: {sex_id: {$in: [0, sex_id]}}},
        {$facet: {
          categories: setFacetItem('$category_id'),
          brands: setFacetItem('$brand'),
          sizes: setFacetItem('$sizes'),
          colors: setFacetItem('$colors'),
          price_from: {$group: {"_id": null, "price_from": { "$min": "$price" }}},
          price_to: {$group: {"_id": null, "price_to": { "$max": "$price" }}},
          sale_from: {$group: {"_id": null, "sale_from": { "$min": "$sale" }}},
          sale_to: {$group: {"_id": null, "sale_to": { "$max": "$sale" }}},
          }}
      ])
    .then(res => {
      lru.set(sex_id, res[0])
      return res[0]
    })
  }
}