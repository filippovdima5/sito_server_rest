import config from 'config'
import Koa from "koa"
const app = new Koa()


// Middleware:
if (process.env.NODE_ENV === 'production'){
  require('./middlewares/koa-favicon').init(app)
  require('./middlewares/error-handler').init(app)
  require('./middlewares/koa-static').init(app)
  require('./middlewares/koa-bodyparser').init(app)
} else {
  require('./middlewares/koa-favicon').init(app)
  require('./middlewares/error-handler').init(app)
  require('./middlewares/koa-logger').init(app)
  require('./middlewares/koa-static').init(app)
  require('./middlewares/koa-bodyparser').init(app)
}


//Routes:
require('./routs/user').init(app)
require('./routs/products').init(app)
require('./routs/search').init(app)




// Listen:
app.listen(config.get('server.port'), () => {
  console.log(`SITO_REST_SERVER started at port : ${config.get('server.port')}`)
})
