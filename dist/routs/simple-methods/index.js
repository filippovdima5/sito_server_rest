"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const all_brands_1 = require("./all-brands");
const popular_brands_1 = require("./popular-brands");
const router = new koa_router_1.default({ prefix: `/api/simple` });
router.get('/all-brands', all_brands_1.allBrands);
router.get('/popular-brands', popular_brands_1.popularBrands);
exports.init = (app) => app.use(router.routes());
