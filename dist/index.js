"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const koa_1 = __importDefault(require("koa"));
const app = new koa_1.default();
if (process.env.NODE_ENV === 'production') {
    require('./middlewares/koa-favicon').init(app);
    require('./middlewares/error-handler').init(app);
    require('./middlewares/koa-static').init(app);
    require('./middlewares/koa-bodyparser').init(app);
}
else {
    require('./middlewares/koa-favicon').init(app);
    require('./middlewares/error-handler').init(app);
    require('./middlewares/koa-logger').init(app);
    require('./middlewares/koa-static').init(app);
    require('./middlewares/koa-bodyparser').init(app);
}
require('./routs/user').init(app);
require('./routs/products').init(app);
require('./routs/search').init(app);
require('./routs/simple-methods').init(app);
app.listen(config_1.default.get('server.port'), () => {
    console.log(`SITO_REST_SERVER started at port : ${config_1.default.get('server.port')}`);
});
