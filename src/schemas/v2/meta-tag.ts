import { Document, Schema } from 'mongoose'
import { mongoose } from '../../libs/mongoose'


export interface MetaTagType {
  link: string,
  title: string,
  description: string,
  
  canonical: string,
}

export interface MetaTagInterface extends MetaTagType, Document {}

const MetaTagSchema = new Schema({
  link: { type: String, index: true, unique: true },
  title: String,
  description: String,
  
  canonical: String,
})


export const MetaTags = mongoose.model<MetaTagInterface>('Meta-tag', MetaTagSchema)

