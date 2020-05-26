import { ProductsRequestFields } from '../types'


export function setRangeQuery(params: ProductsRequestFields, query: any): null {
  const priceQuery: any = {}
  const saleQuery: any = {}
  
  if (params.price_from || params.sale_from) {
    if (params.price_from) priceQuery['$gte'] = params.price_from
    if (params.price_to) priceQuery['$lte'] = params.price_to
    query['price'] = priceQuery
  }
  
  if (params.sale_from || params.sale_to) {
    if (params.sale_from) saleQuery['$gte'] = params.sale_from
    if (params.sale_to) saleQuery['$lte'] = params.sale_to
    query['sale'] = saleQuery
  }
  
  return null
}


