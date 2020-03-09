import { Document, Schema } from 'mongoose'
import { mongoose } from '../libs/mongoose'


export type Pathname = '/' | 'products' | 'brands' | 'likes' | 'blog' | 'about'


export interface ISeoDocument extends Document{
  pathname: Pathname,
  sex: 1 | 2 | 0,
  category: number | 0,
  subcategory: number | 0,
  
  title: string,
  description: string
}

const seoScheme = new Schema({
  pathname: {
    type: String,
  },
  sex: {
    type: Number,
    enum: [1, 2, 0]
  },
  category: {
    type: Number
  },
  subcategory: {
    type: Number
  },
  
  title: String,
  description: String
})

export const Seo = mongoose.model<ISeoDocument>('Seo', seoScheme)