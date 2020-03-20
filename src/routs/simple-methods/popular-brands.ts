import { RouterContext } from 'koa-router'
import { Products } from '../../schemas/products'
import { createCache } from '../../helpers/create-cache'
import LRU from 'lru'


const popularBrandsLRU = new LRU<Array<string>>({ max: 10, maxAge: 10 * 60 * 1000 })
const cacheRender = createCache(popularBrandsLRU)

async function renderPopularBrands({ sexId }: { sexId: 1 | 2 | 'uni' }): Promise<Array<string>> {
  const matchSex = sexId !== 'uni' ? {$in: [sexId, 0]} : {$in: [1, 2, 0]}
  
  return await Products.aggregate([
    {$match: {sex_id: matchSex}},
    {$group: {
        _id: "$brand",
        count: {$sum: 1}
      }},
    {$sort: { count: -1 }},
    {$limit: 52}
  ])
    .then(res => {
      console.log(res)
      let c = (a: any) => 10 > a ? 2e4 + +a : a.charCodeAt(0);
      return res
        .sort((a, b) => c(a._id) - c(b._id))
        .map(item => item._id)
    })
}


export async function popularBrands(ctx: RouterContext) {
  const query = ctx.request.query
  
  console.log(query)
  let sexId: 1 | 2 | 'uni'
  switch (query.sexId) {
    case '1':
    case '2':sexId = (Number(query.sexId) as 1 | 2); break
    default: sexId = 'uni'
  }
  
  const cacheKey = sexId.toString()
  ctx.body = await cacheRender(
    () => renderPopularBrands({ sexId }),
    cacheKey,
    () => []
  )()
}
