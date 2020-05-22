import Router, { RouterContext } from 'koa-router'
import { Session , ONE_WEEK_MILLISECONDS } from '../../schemas/v2/session'



const route = new Router()

route.get('/', async (ctx: RouterContext) => {
  const cookie = ctx.cookies.get('session-sito')
  if (cookie) {
    const result = await Session.findOne({ _id: cookie }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })
    if (result !== null) {
      ctx.body = result
      return
    }
  }
  
  const { sex_id } = ctx.query
  
  const newSession = new Session({ sex_id: sex_id ?? null, like_products: [] })
  return newSession.save()
    .then(res => {
      ctx.cookies.set('session-sito', res._id, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_WEEK_MILLISECONDS)
      })
      ctx.body = newSession
    })
})

export { route as sessionMount }
