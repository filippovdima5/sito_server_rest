import bodyParser from 'koa-bodyparser'

exports.init = (app: any) => app.use(bodyParser({
  jsonLimit: '56kb',
}));