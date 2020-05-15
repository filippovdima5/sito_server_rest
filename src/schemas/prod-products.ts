import { Document,  Schema, SchemaDefinition } from 'mongoose'
import { SexId } from '../types'
import { mongoose } from '../libs/mongoose'


export interface ProdProductType  {
  id_raw: string,
  site_name: string,
  category_num: string,
  
  title: string,
  price: number,
  oldprice: number,
  sale: number,
  brand: string,
  img: Array<string>,
  url: string,
  sex_id: SexId,
  category_id: number,
  
  sizes?: Array<string>,
  colors?: Array<string>,
}

export interface ProdProductInterface extends Document, ProdProductType{}

export const ProdProductDefinition: SchemaDefinition = {
  id_raw: { type: String, unique: true },
  site_name: String,
  category_num: String,
  
  title: String,
  price: Number,
  oldprice: Number,
  sale: Number,
  brand: String,
  img: [String],
  url: String,
  sex_id: Number,
  category_id: Number,
  
  colors: [String],
  sizes: [String],
}

const ProdProductsScheme = new Schema(ProdProductDefinition,
  { timestamps: true })


ProdProductsScheme.index({ id_raw: 1 })
ProdProductsScheme.index({ sex_id: 1 })
ProdProductsScheme.index({ category_num: 1 })


export const ProdProducts = mongoose.model<ProdProductInterface>('Products', ProdProductsScheme)

