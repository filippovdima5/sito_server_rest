import Koa from 'koa'
import Cookies   from 'cookies'



const defaultNext = () => Promise.resolve()



const setCookie = (name: string, value: string, config: Cookies.SetOption) =>
  async (ctx: Koa.Context, next = defaultNext) => {
    ctx.cookies.set(
      encodeURIComponent(name),
      encodeURIComponent(value),
      config
    )
    await next()
  }







