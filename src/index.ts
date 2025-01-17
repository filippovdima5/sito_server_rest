import config from 'config'
import Koa from 'koa'
import { routerApiV2 } from './api-v2'


const app = new Koa()


// Middleware:
if (process.env.NODE_ENV === 'production'){
  require('./middlewares/koa-favicon').init(app)
  require('./middlewares/error-handler').init(app)
  require('./middlewares/koa-bodyparser').init(app)
} else {
  require('./middlewares/koa-favicon').init(app)
  require('./middlewares/error-handler').init(app)
  require('./middlewares/koa-logger').init(app)
  require('./middlewares/koa-bodyparser').init(app)
}


app.use(routerApiV2.routes())


//Routes:
require('./routs/user').init(app)
require('./routs/products').init(app)
require('./routs/search').init(app)
require('./routs/simple-methods').init(app)
require('./routs/seo').init(app)



// Listen:
app.listen({ port: config.get('server.port') }, () => {
  console.log(`SITO_REST_SERVER started at port : ${config.get('server.port')}`)
})
