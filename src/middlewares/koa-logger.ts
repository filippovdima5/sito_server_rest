import logger from "koa-logger"

exports.init = (app: any) => {
  return app.use(logger())
}