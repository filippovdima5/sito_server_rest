import { User } from '../../schemas/user'
import { hideSpecialFields } from '../../libs/hide-special-fields'


export async function userGet(ctx: any) {
  const userId = await User.getIdUser(ctx)
  
  ctx.body = await User.findOne({_id: userId}, hideSpecialFields)
}

