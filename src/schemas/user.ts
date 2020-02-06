import { Document, Model, Schema } from 'mongoose'
import {mongoose} from '../libs/mongoose'
import { NullableRecord } from '../types'
import { AllCategoriesClothes, AllCategoriesShoes, AllCategoriesAccessories } from '../types'
import { Context } from 'koa'


export interface IUserDocument extends Document{
  sex_id: 1 | 2 | null,
  clothes: NullableRecord<keyof AllCategoriesClothes, number>,
  shoes: NullableRecord<keyof AllCategoriesShoes, number>,
  accessories: NullableRecord<keyof AllCategoriesAccessories, number>,
  brands: NullableRecord<any, number>
}

export interface IUserModel extends Model<IUserDocument>{
  getIdUser(ctx: Context): Promise<string>
}

const userScheme = new Schema({
  sex_id: {
    type: Number,
    enum: [1, 2, 0]
  },
  clothes: {},
  shoes: {},
  accessories: {},
  brands: {},
}, {
  timestamps: true
})

userScheme.statics.getIdUser = async function getIdUser(ctx: Context): Promise<string> {
  const cookie = ctx.cookies.get('user')
  if (cookie) return cookie
  const newUser = new User({})
  return newUser.save()
    .then(res => {
      ctx.cookies.set('user', res._id)
      return res._id
    })
}

export const User = mongoose.model<IUserDocument, IUserModel>('User', userScheme)