import session from 'koa-session'

exports.init = (app: any) => {
  app.keys = ['SECRET'];
  return app.use(session({
    key: 'sito:sess',
    rolling: true,
    signed: false
    //renew: true,
  }, app))
}