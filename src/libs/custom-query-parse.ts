import { SexId, ValueOf } from '../types'
import { unisexCategoryKeys } from '../constants'


const sortTypes = {
  'create_up': { createdAt: -1 },
  'create_down': { createdAt: 1 },
  'price_up': { price: -1 },
  'price_down': { price: 1 },
  'sale_up' : { sale: -1 },
  'sale_down' : { sale: 1 },
} as const

export type SortTypes = ValueOf<typeof sortTypes>

type QueryFields = {
  sex_id?: SexId,
  price_from?: number,
  price_to?: number,
  sale_from?: number,
  sale_to?: number,
  page?: number,
  limit?: number,
  brands?: Array<string>,
  sizes?: Array<string>,
  categories?: Array<keyof typeof unisexCategoryKeys>,
  sort?: SortTypes,
  
  brand_search?: string,
  brand_all?: boolean,
}



export function customQueryParse(search: string): QueryFields {
  if (!search || search === '?') return {}
  
  let foundFields: any = {}
  
  
  try {
    foundFields = Object.fromEntries(
      decodeURI(search).replace('?', '')
        .split('&')
        .map(i => i.split('='))
    )
  } catch (e) {
    console.error(e)
    return foundFields
  }
  
  Object.entries(foundFields).forEach(([key, value]) => {
    switch (key) {
      case 'sex_id':
      case 'price_from':
      case 'price_to':
      case 'sale_from':
      case 'sale_to':
      case 'page':
      case 'limit': return (foundFields[key] = parseNumber(value as string))
      case 'brands':
      case 'sizes': return (foundFields[key] = parseArrayString(value as string))
      case 'categories': return (foundFields[key] = parseArrayNumber(value as string))
      case 'sort': return (foundFields[key] = sortTypes[value as keyof typeof sortTypes])
      default: return (foundFields[key] = parseOtherStrings(value as string))
    }
  })
  
  return foundFields
}


function parseNumber(str: string): number | null {
  if (isNaN(Number(str))) return null
  return Number(str)
}

function parseArrayNumber(str: string): Array<number> | null {
  if (!str) return null
  return str.split(',').filter(i => !isNaN(Number(i))).map(i => Number(i))
}

function parseArrayString(str: string): Array<string> |  null {
  if (!str) return null
  return str.split(' | ')
}

function parseOtherStrings(str: string): string | number | boolean | null {
  if (str.length > 20) return null
  if (!isNaN(Number(str))) return Number(str)
  switch (str) {
    case 'true': return true
    case 'false': return false
  }
  return str
}

