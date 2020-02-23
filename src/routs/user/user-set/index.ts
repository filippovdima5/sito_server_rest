import { User } from '../../../schemas/user'
import { sendOk } from '../../../libs'


export async function userSet(ctx: any) {
  const userId = await User.getIdUser(ctx)
  
  await User.findOneAndUpdate(
    {_id: userId},
    ctx.request.body
  )
  
  ctx.body = sendOk()
}



