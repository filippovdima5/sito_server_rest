import { SortTypes } from './libs/custom-query-parse'
import { unisexCategoryKeys } from './constants'


export type SexId = 1 | 2

export type ValueOf<T> = T[keyof T]


export type ProductsRequestFields = {
  sex_id?: SexId,
  limit?: number,
  sort?: SortTypes,
  page?: number,
  categories?: Array<keyof typeof unisexCategoryKeys>,
  brands?: Array<string>,
  sizes?: Array<string>,
  price_from?: number,
  price_to?: number,
  sale_from?: number,
  sale_to?: number,
}

