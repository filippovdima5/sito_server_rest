import { Document, Model, Schema } from 'mongoose'
import {mongoose} from '../libs/mongoose'


export interface ProductsInterface extends Document {
  id: string,
  title: string,
  description: string,
  category_id: number,
  brand: string,
  size: string,
  color: string,
  price: number,
  oldprice: number,
  sale: number,
  img: Array<string>,
  url: string,
}

const productsScheme = new Schema({
  id: String,
  title: String,
  description: String,
  category_id: Number,
  brand: String,
  size: String,
  color: String,
  price: Number,
  oldprice: Number,
  sale: Number,
  img: [String],
  url: String
},
  {
    timestamps: true
  })

export const Products = mongoose.model<ProductsInterface>('Products', productsScheme)