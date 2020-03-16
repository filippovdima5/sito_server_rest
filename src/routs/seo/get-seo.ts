import { Seo } from '../../schemas/seos'
import LRU from 'lru'
import { RouterContext } from 'koa-router'
import { Pathname } from '../../schemas/seos'
import {findCategory, findPathname} from './lib'
import { createCache } from '../../helpers/create-cache'
import { recordToCacheKey } from '../../helpers/record-to-cache-key'

type SeoTags = {
  title: string,
  description: string
}

const defaultSeo = {
  title: 'SITO - сайт выгодных скидок. Каталог акций в интернет-магазинах.',
  description: 'Все скидки рунета на SITO: поиск выгодных цен на одежду, обувь и аксессуары в интернет-магазинах. Агрегатор скидок – акции от 50%'
} as SeoTags


const seoLRU = new LRU<SeoTags>({ max: 10, maxAge: 30 * 60 * 1000 })
const cacheRender = createCache(seoLRU)


async function renderSeo({ sexId, path, search }: { sexId: 1 | 2 | null, path: string, search: string }): Promise<SeoTags> {
  try {
    const pathname: Pathname = findPathname(path)
    const sex: 1 | 2 | 0 = sexId === null ? 0 : sexId
    let category = 0
    let subcategory = 0
  
  
    const categories = findCategory(search)
    if (categories.length === 1) category = categories[0]
  
    if (categories.length > 1) {
      const subs = categories.map(item => (Math.trunc(item)))
      const setSub = new Set([...subs])
    
      const arrSub = Array.from(setSub)
      if ( arrSub.length === 1 ) subcategory = arrSub[0]*1000
    }
  
    return await Seo.findOne({ pathname, sex, category, subcategory: Math.trunc(subcategory/1000) })
      .then(res => {
        if (res === null) return  defaultSeo;
        else  return  {title: res.title, description: res.description}
      })
  } catch (e) {
    return defaultSeo
  }
}


export async function getSeo(ctx: RouterContext) {
    const body = ctx.request.body
  
    const sexId = body.sexId as 1 | 2 | null;
    const path = body.path as string;
    const search = body.search as string;
    
    const cacheKey = recordToCacheKey({ sexId, path, search })
    ctx.body = await cacheRender(() => renderSeo({ sexId, path, search }), cacheKey)()
  
    if (ctx.status !== 200) {
      seoLRU.remove(cacheKey)
    }
}
