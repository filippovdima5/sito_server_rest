"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const user_get_1 = require("./user-get");
const user_set_1 = require("./user-set");
const user_id_get_1 = require("./user-id-get");
const router = new koa_router_1.default({ prefix: `/api/user` });
router.get('/', user_get_1.userGet);
router.post('/', user_set_1.userSet);
router.get('/byId', user_id_get_1.userIdGet);
exports.init = (app) => app.use(router.routes());
