import Router, { RouterContext } from 'koa-router'
import LRU from 'lru'
import { createCache } from '../../helpers/create-cache'
import { MetaTags } from '../../schemas/v2/meta-tag'


const ONE_WEEK = 1000 * 60 * 60 * 24 * 7
const route = new Router()

// $TODO: Вынести в nginx:
const lru = new LRU<any>({ max: 200, maxAge: ONE_WEEK })
const getCache = createCache(lru)



// region
route.post('/', async (ctx: RouterContext) => {
  const { link } = ctx.request.body
  if (!link) return ctx.throw('Нет')
  
  ctx.body = await getCache(
    () => getMetaTags({ link: link.toString() }),
    link
  )()
  
})
export { route as getMetaTags }
// endregion

async function getMetaTags({ link }: { link: string }) {
  return MetaTags.findOne({ link }, { _id: 0, __v: 0 })
}
