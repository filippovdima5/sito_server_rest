import { Products } from '../../schemas/products'
import { queryNormalization } from '../../helpers/queryNormalization'


type ReqParams = {
  sex_id: 1 | 2,
  brands?: Array<string> | null,
  categories?: Array<number> | null,
  sizes?: Array<string> | null,
  colors?: Array<string> | null,
  page?: number | null,
  sort?: 'update_up' | 'price_up' | 'sale_up' | null,
  limit: number | null,
}


const defaultParams: DefaultParams = {
  //sex_id: 1,  // todo: Cдкоать метод запроса из кукрв, etc,,, // !!!!
  brands: null,
  categories: null,
  sizes: null,
  colors: null,
  page: 1,
  sort: 'update_up',
  limit: 20
}


export async function productsList(ctx: any) {
 // const {sex_id, brands, categories, colors, limit, page, sizes, sort} = queryNormalization(ctx.request.body as any, defaultParams)
 // const skip = ( page - 1 ) * limit




}


