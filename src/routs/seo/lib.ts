import { Pathname } from '../../schemas/seos'

export const findPathname = (path: string): Pathname => {
  if (path.includes('products')) return 'products'
  if (path.includes('brands')) return 'brands'
  if (path.includes('likes')) return 'likes'
  if (path.includes('blog')) return 'blog'
  if (path.includes('about')) return 'about'
  return '/'
}


export const findCategory = ( search: string ): Array<number> => {
  if (!search.includes('categories')) return []
  
  const arrParams = search
    .split('&')
    .map(item => item.split('=')) as Array<['categories', string]>
  
  
  const categoriesStr = arrParams.find((item) => (item[0] === 'categories'))
  
  if (categoriesStr === undefined) return []
  
  return categoriesStr[1].split('|').map(value => +value)
}