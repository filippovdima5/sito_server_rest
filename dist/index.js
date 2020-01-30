"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_router_1 = __importDefault(require("koa-router"));
const config_1 = __importDefault(require("config"));
const koa_logger_1 = __importDefault(require("koa-logger"));
const app = new koa_1.default();
const router = new koa_router_1.default();
router.get("/", (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = { msg: "Hello world!" };
    yield next();
}));
app.use(koa_logger_1.default());
app.use(router.routes()).use(router.allowedMethods());
app.listen(config_1.default.get('server.port'), () => {
    console.log("Koa started");
});
//# sourceMappingURL=index.js.map