import Koa = require('koa')

exports.init = (app: any) =>app.use(async (ctx: Koa.BaseContext, next: () => Promise<any>) => {
  try {
    await next()
  } catch (e) {
    if (e.status){
      ctx.body = e.message
      ctx.status = e.status
    } else {
      ctx.body = 'One of us is a teapot!'
      ctx.status = 500
      console.error(e.message, e.stack)
    }
  }

})
