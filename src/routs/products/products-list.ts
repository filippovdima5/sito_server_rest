import { queryNormalization } from '../../helpers/queryNormalization'
import { Products } from '../../schemas/products'


type ReqParams = {
  sex_id: 1 | 2,
  brands: Array<string> | null,
  categories: Array<number> | null,
  sizes: Array<string> | null,
  colors: Array<string> | null,
  page: number,
  sort: 'update_up' | 'price_up' | 'sale_up',
  limit: number,
}

const requiredFields: Array<keyof ReqParams> = ['sex_id']

const defaultParams: any = {
  page: 1,
  sort: 'update_up',
  limit: 20
}


export async function productsList(ctx: any) {
  const {sex_id, brands, categories, colors, limit, page, sizes, sort} = queryNormalization(ctx.request.body as ReqParams, defaultParams, requiredFields)
  const skip = ( page - 1 ) * limit


}


