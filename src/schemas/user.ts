import { Document, Model, Schema } from 'mongoose'
import {mongoose} from '../libs/mongoose'
import { NullableRecord } from '../types'
import { AllCategoriesClothes, AllCategoriesShoes, AllCategoriesAccessories } from '../types'
import { Context } from 'koa'


export interface IUserDocument extends Document{
  sex_id: 1 | 2 | null,
  likes: Array<string>,
}

export interface IUserModel extends Model<IUserDocument>{
  getIdUser(ctx: Context): Promise<string>
}

const userScheme = new Schema({
  sex_id: {
    type: Number,
    enum: [1, 2, 0]
  },
  likes: {
    type: [String],
  }
}, {
  timestamps: true
})

userScheme.statics.getIdUser = async function getIdUser(ctx: Context): Promise<string> {
  const cookie = ctx.cookies.get('user')
  
  if (cookie) {
    const checkUser = await User.findOne({_id: cookie})
    if (Boolean(checkUser)) return cookie
  }
  
  
  const newUser = new User({})
  return newUser.save()
    .then(res => {
      ctx.cookies.set('user', res._id, { httpOnly: true, maxAge: 9999999999999})
      return res._id
    })
}

export const User = mongoose.model<IUserDocument, IUserModel>('User', userScheme)