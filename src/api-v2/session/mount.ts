import Router, { RouterContext } from 'koa-router'
import { Session , ONE_WEEK_MILLISECONDS } from '../../schemas/v2/session'



const route = new Router()

route.get('/', async (ctx: RouterContext) => {
  const { sex_id } = ctx.query
  const cookie = ctx.cookies.get('session-sito')
  
  if (cookie && sex_id) {
    const result = await Session.findOneAndUpdate({ _id: cookie }, { sex_id }, { new: true, upsert: true })
    if (result !== null) {
      ctx.body = result
      return
    }
  }
  if (cookie && !sex_id) {
    const result = await Session.findOne({ _id: cookie })
    if (result !== null) {
      ctx.body = result
      return
    }
  }
  
  const newSession = new Session({ sex_id: sex_id ?? null, like_products: [], expires: new Date() })
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
