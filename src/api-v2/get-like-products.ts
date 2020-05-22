import Router, { RouterContext } from 'koa-router'
import { Products } from '../schemas/v2/products'
import { Session } from '../schemas/v2/session'


const route = new Router()

route.get('/', async (ctx: RouterContext) => {
  const cookie = ctx.cookies.get('session-sito')
  if (!cookie) {
    ctx.body = []
    return 
  }
  
  const productsIds = await Session.findOne({ _id: cookie })
    .then(res => {
      if (res === null) return []
      return res.like_products
    })
  
  if (productsIds.length === 0) {
    ctx.body = []
    return 
  }
  
  return await Products.aggregate([
    { $project: {
      id: { $toString: '$_id' },
      _id: 0,
      title: '$title',
      brand: '$brand',
      sexId: '$sex_id',
      categoryId: '$category_id',
      sizes: '$sizes',
      colors: '$colors',
      images: '$img',
      price: '$price',
      oldPrice: '$oldprice',
      sale: '$sale',
    } },
    { $match: { id: { $in: productsIds } } }
  ])
    .then(res => {
      if (!res) return ctx.body = []
      if (!res[0]) return ctx.body = []
      ctx.body = res
    })
})

export { route as getLikeProducts }
