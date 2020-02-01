import Koa from 'koa'
import { Products } from '../../schemas/products'
import { SexId } from '../../types'
import { queryNormalization } from '../../helpers/queryNormalization'


type ReqParams = {
  sex_id?: SexId,
  brands?: Array<string>,
  categories?: Array<number>,
  sizes?: Array<string>,
  colors?: Array<string>,
  page?: number,
  sort?: 'update_up' | 'price_up' | 'sale_up',
  limit?: number,
}

type DefaultParams = {
  sex_id: SexId,
  brands?: Array<string>,
  categories?: Array<number>,
  sizes?: Array<string>,
  colors?: Array<string>,
  page: number,
  sort: 'update_up' | 'price_up' | 'sale_up',
  limit: number,
}

type MatchParams = {
  sex_id: {$in: [0, SexId]},
  page: Number,
}

const defaultParams: DefaultParams = {
  sex_id: 1,  // todo: Cдкоать метод запроса из кукрв, etc,,,
  page: 1,
  sort: 'update_up',
  limit: 20
}


export async function productsList(ctx: any) {
  const {sex_id, brands, categories, colors, limit, page, sizes, sort} = queryNormalization(ctx.request.body as ReqParams, defaultParams)
  const skip = ( page - 1 ) * limit
  const matchParams: MatchParams = {
    sex_id: {$in: [0, sex_id]}
  }

}


