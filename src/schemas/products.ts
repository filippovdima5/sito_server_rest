import mongoose, { Document, Model, Schema } from 'mongoose'

export type ProductsFields = {
  id: string,
  title: string,
  description: string,
  

  brand: string,
  category: string,
  category_id: number,
  color: string,

}