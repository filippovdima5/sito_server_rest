import { Context } from 'koa'
import { User } from '../../schemas/user'
import { hideSpecialFields } from '../hide-special-fields'

const parseSortUserInfo = (obj: any): any => {
    // @ts-ignore
  return Object.entries(obj)
    // @ts-ignore
      .sort((a, b) => (b[1] - a[1]))
    // @ts-ignore
      .map(item => isNaN(item[0]) ? item[0] : +item[0])
}

type Partners = {
  title: string,
  img: string,
  url: string
}

type Brands = {
  title: string,
  img: string,
  url: string
}

//todo: Временно, потом будет коллекция из которой это запрашивается:
const getBrands = async function getBrands(): Promise<Array<Brands>> {
  return [
    {title: 'Adidas', img: 'http://localhost:3000', url: '/brands/Adidas'},
    {title: 'Nike', img: 'http://localhost:3000', url: '/brands/Nike'}
  ]
}

const getPartners = async function getPartners(): Promise<Array<Partners>> {
  return [
    {title: 'Lamoda', img: 'http://localhost:3000', url: 'http://localhost:3000'},
    {title: 'Incanto', img: 'http://localhost:3000', url: 'http://localhost:3000'}
  ]
}

type Env = {
  sex_id: 1 | 2 | null,
  clothes: Array<number> | null,
  shoes: Array<number> | null,
  accessories: Array<number> | null,
  partners: Array<Partners> | null,
  brands: Array<Brands> | null,
}

export async function mainEnv(ctx: Context){
  const userId = await User.getIdUser(ctx)

  await Promise.all([
    User.findOne({_id: userId}, hideSpecialFields),
    Promise.resolve(getBrands()),
    Promise.resolve(getPartners())
  ])
    .then(([user, brands, partners]) => {
      if (!user) return null
      console.log(brands)
      // @ts-ignore
      const env: Env = {
        // @ts-ignore
        brands: brands,
        // @ts-ignore
        partners: partners,
        clothes: user.clothes ? parseSortUserInfo(user.clothes) : null,
        shoes: user.shoes ? parseSortUserInfo(user.shoes) : null,
        // @ts-ignore
        //brands: user.brands ? parseSortUserInfo(user.brands) : null
      }
      if (user)
        if (user.sex_id) env.sex_id = user.sex_id === 1 ? 1 : 2
        else env.sex_id = null
      else env.sex_id = null

      return env
    })
    .then(res => {
      ctx.body = res
    })

}