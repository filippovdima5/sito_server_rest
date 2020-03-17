"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = (app) => app.use(async (ctx, next) => {
    try {
        await next();
    }
    catch (e) {
        if (e.status) {
            ctx.body = e.message;
            ctx.status = e.status;
        }
        else {
            ctx.body = 'One of us is a teapot!';
            ctx.status = 500;
            console.log(e.message, 'Нужно выводить ошибки в логи mongoDB!');
        }
    }
});
