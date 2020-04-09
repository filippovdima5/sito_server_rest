import { Products } from '../schemas/products'


async function f() {
  await Products.deleteMany({ parser_name: 'YOOX' })
}

f()
