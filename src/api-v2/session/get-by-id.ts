import Router, { RouterContext } from 'koa-router'
import { Session } from '../../schemas/v2/session'


const route = new Router()

route.get('/', async (ctx: RouterContext) => {
  const { id } = ctx.query
  if (!id) return ctx.throw('Нет id')
  
  return Session.findOne({ _id: id })
    .then(res => {
      if (res === null) return null
      return (ctx.body = { id: res._id, ...res })
    })
})



export { route as sessionGetById }
