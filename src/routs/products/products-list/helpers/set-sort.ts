import { Sort } from '../index'

export const setSort = (sort: Sort) => {
  switch (sort) {
    case 'update_up': return {updatedAt: 1};
    case 'price_up' : return {price: -1};
    case 'sale_up' : return {sale: -1};
    default: return {updatedAt: 1};
  }
};