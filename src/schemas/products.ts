import mongoose, { Document, Model, Schema } from 'mongoose'


export interface ProductsInterface extends Document {
  id: string,
  title: string,
  description: string,
  category: string,
  category_id: number,
  brand: string,
  size: string,
  color: string,
  price: number,
  oldprice: number,
  sale: number,
  img: Array<string>
}

const productsScheme = new Schema({
  id: String,
  title: String,
  description: String,
  category: String,
  category_id: Number,
  brand: String,
  size: String,
  color: String,
  price: Number,
  oldprice: Number,
  sale: Number,
  img: [String]
})

export const Products = mongoose.model<ProductsInterface>('Products', productsScheme)