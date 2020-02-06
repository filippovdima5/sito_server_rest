import {Context} from 'koa'
import { User } from '../../schemas/user'
import { NullableRecord } from '../../types'
import { sendOk } from '../response'

type QueryRequest = {
  sex_id?: 1 | 2,
  $inc?: NullableRecord<string, 1>
}

export async function userPost(ctx: Context) {
  const query: NullableRecord<'sex_id' | 'clothes' | 'shoes' | 'accessories' | 'brands', string> = ctx.request.query;
  const postQuery: QueryRequest = {}


  if (query.sex_id) postQuery.sex_id = (query.sex_id === '1' ? 1 : 2)
  if (query.clothes || query.shoes || query.accessories || query.brands) {
    postQuery.$inc = {}
    if (query.clothes) postQuery.$inc[`clothes.${query.clothes}`] = 1
    if (query.brands) postQuery.$inc[`brands.${query.brands}`] = 1
    if (query.accessories) postQuery.$inc[`accessories.${query.accessories}`] = 1
  }

  const cookie = await User.getIdUser(ctx)
  await User.findOneAndUpdate({_id: cookie}, postQuery)


  ctx.body = sendOk()
}



