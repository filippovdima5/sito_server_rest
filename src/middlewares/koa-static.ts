import serve from 'koa-static'
exports.init = (app: any) => app.use(serve('public'))