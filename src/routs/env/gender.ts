import { User } from '../../schemas/user'
import {Context} from 'koa'


export async function genderInfo(ctx: Context) {
  const id = await User.getIdUser(ctx)

  return await User.findOne({_id: id})
    .then(res => {
      if (res) return res.sex_id
      else return 0
    })
    .then(res => {
      ctx.body = {sexId: res}
    })
}