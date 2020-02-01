import Koa = require('koa');

exports.init = (app: any) =>app.use(async (ctx: Koa.BaseContext, next: () => Promise<any>) => {
  try {
    await next();
  } catch (e) {
    if (e.status){
      ctx.body = e.message;
      ctx.status = e.status;
    } else {
      ctx.body = 'Error 500';
      ctx.status = 500;
      //console.log(e.message, e.stack);
      console.log(e.message, 'Нужно выводить ошибки в логи mongoDB!')
    }
  }

});