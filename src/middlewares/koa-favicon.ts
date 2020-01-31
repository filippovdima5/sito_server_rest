import favicon from 'koa-favicon'

exports.init = (app: any) => app.use(favicon('public/favicon.ico'))