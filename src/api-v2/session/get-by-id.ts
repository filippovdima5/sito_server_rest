import Router, { RouterContext } from 'koa-router'
import { Session } from '../../schemas/v2/session'


const route = new Router()

route.get('/', async (ctx: RouterContext) => {
  const { id } = ctx.query
  if (!id) return ctx.throw('Нет id')
  
  
  return await Session.findOne({ _id: id })
    .then(res => {
      if (res === null) return (ctx.body = null)
      return (ctx.body = { id: res._id, sex_id: res.sex_id, like_products: res.like_products  })
    })
})



export { route as sessionGetById }
