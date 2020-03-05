import { RouterContext } from 'koa-router'
import { Products } from '../../schemas/products'



type Brand = {
  _id: string,
  count: number
}



export async function allBrands(ctx: RouterContext) {
  const query = ctx.request.query
  
  console.log(query)
  
  let sexId: number
  
  switch (query.sexId) {
    case '1':
    case '2':
      sexId = Number(query.sexId); break
    default: throw Error('Не верный gender')
  }
  
  
  return await Products.aggregate([
    {$match: {sex_id: sexId}},
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
        
        console.log(currentChar.toLowerCase(), _id.charAt(0).toLowerCase())
        
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
  
    .then(res => {
      ctx.body = res
    })
}