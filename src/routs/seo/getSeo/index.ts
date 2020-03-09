import { Seo } from '../../../schemas/seos'
import { RouterContext } from 'koa-router'
import { Pathname } from '../../../schemas/seos'
import {findCategory, findPathname} from '../lib'

const defaultSeo = {
  title: 'SITO - сайт выгодных скидок. Каталог акций в интернет-магазинах.',
  description: 'Все скидки рунета на SITO: поиск выгодных цен на одежду, обувь и аксессуары в интернет-магазинах. Агрегатор скидок – акции от 50%'
}


export async function getSeo(ctx: RouterContext) {
  try {
    const body = ctx.request.body
  
    const sexId = body.sexId as 1 | 2 | null;
    const path = body.path as string;
    const search = body.search as string;
  
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
    
    
  
    await Seo.findOne({ pathname, sex, category, subcategory: Math.trunc(category/1000) })
      .then(res => {
        if (res === null) ctx.body = defaultSeo;
        else  ctx.body = {title: res.title, description: res.description}
      })
  } catch (e) {
    ctx.body = defaultSeo
  }
}