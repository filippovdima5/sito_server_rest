"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const main_search_1 = require("./main-search");
const router = new koa_router_1.default({ prefix: `/api/search` });
router.post('/main-search', main_search_1.mainSearch);
exports.init = (app) => app.use(router.routes());
