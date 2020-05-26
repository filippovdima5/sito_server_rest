import Router, { RouterContext } from 'koa-router'
import { Session } from '../../schemas/v2/session'


const route = new Router()

route.get('/', async (ctx: RouterContext) => {
  const { id, type_set } = ctx.query
  const updateQuery: any = {}
  
  switch (type_set) {
    case 'add': updateQuery['$push'] = { like_products: id }; break
    case 'del': updateQuery['$pull'] = { like_products: id }; break
    default: return ctx.throw('Хуй')
  }
  
  const cookie = ctx.cookies.get('session-sito')
  await Session.updateOne({ _id: cookie }, updateQuery)
  ctx.body = 'OK'
})

export { route as setLike }
