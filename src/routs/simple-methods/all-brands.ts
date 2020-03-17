import { RouterContext } from 'koa-router'
import { Products } from '../../schemas/products'
import { createCache } from '../../helpers/create-cache'
import LRU from "lru"


type Brand = {
  _id: string,
  count: number
}

type Request = Array<{
  char: string,
  brands: Array<Brand>
}>

const allBrandsLRU = new LRU<Request>({ max: 10, maxAge: 10 * 60 * 1000 })
const cacheRender = createCache(allBrandsLRU)

async function renderAllBrands({ sexId }: { sexId: 1 | 2 }): Promise<Request> {
  return await Products.aggregate([
    {$match: {sex_id: {$in: [sexId, 0]}}},
    {$group: {
        _id: "$brand",
        count: {$sum: 1}
      }}
  ])
    .then(res => res.filter(item => (item.count > 10 && Boolean(item._id))) as Array<Brand>)
    
    .then(res => {
      let c = (a: any) => 10 > a ? 2e4 + +a : a.charCodeAt(0);
      return res.sort((a, b) => c(a._id.charAt(0)) - c(b._id.charAt(0)))
    })
    
    .then(res => {
      const arr: Array<{
        char: string,
        brands: Array<Brand>
      }> = []
      
      if (res.length === 0) return []
      
      let currentChar = res[0]._id.charAt(0)
      arr.push({
        char: currentChar,
        brands: [ res[0] ]
      })
      
      res.forEach(({ _id, count }, index) => {
        if (index === 0) return
        
        if (currentChar.toLowerCase() === _id.charAt(0).toLowerCase()) {
          arr[arr.length - 1].brands.push({ _id, count })
        }
        else {
          arr.push({char: _id.charAt(0), brands: [{count, _id}]})
          currentChar = _id.charAt(0)
        }
      })
      
      return arr
    })
}

export async function allBrands(ctx: RouterContext) {
  const query = ctx.request.query

  let sexId: 1 | 2
  
  switch (query.sexId) {
    case '1':
    case '2':
      sexId = (Number(query.sexId) as 1 | 2); break
    default: throw Error('Не верный gender')
  }
  
  const cacheKey = sexId.toString()
  ctx.body = await cacheRender(
    () => renderAllBrands({ sexId }),
    cacheKey,
    () => []
  )()
}
