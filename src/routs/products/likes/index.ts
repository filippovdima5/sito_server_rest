import {Products} from '../../../schemas/products'
import {RouterContext} from 'koa-router'
import {User} from '../../../schemas/user'


export async function getLikes(ctx: RouterContext) {
  const idUser = await User.getIdUser(ctx)
  
  let { likes } = ctx.request.body
  
  if (likes.length === 0) {
    const userLikes = await User.findOne({ _id: idUser })
      .then(res => {
        if (res === null) return []
        return res.likes ?? []
      })
    
    if (userLikes.length > 0) likes = userLikes
    
    else {
      ctx.body = []
      return
    }
    
  }
  
  const likeProducts = await Products.find({id: {$in: likes}})
  await User.updateOne({_id: idUser}, {likes: likeProducts.map(item => (item.id))})
  ctx.body = likeProducts
}

