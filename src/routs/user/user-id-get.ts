import { User } from '../../schemas/user'
import { RouterContext } from 'koa-router'
import { hideSpecialFields } from '../../libs/hide-special-fields'

export async function userIdGet(ctx: RouterContext) {
  const { id } = ctx.query
  
  if (!Boolean(id)){
    ctx.body = {}
    return
  }
  
  const user = await User.findOne({_id: id}, hideSpecialFields)
  
  if (Boolean(user)){
    ctx.body = user
  } else {
    ctx.body = {}
  }
}