"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const get_seo_1 = require("./get-seo");
const router = new koa_router_1.default({ prefix: `/api/seo` });
router.post('/', get_seo_1.getSeo);
exports.init = (app) => app.use(router.routes());
