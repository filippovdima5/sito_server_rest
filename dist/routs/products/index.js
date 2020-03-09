"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const products_list_1 = require("./products-list");
const facet_filters_1 = require("./facet-filters");
const likes_1 = require("./likes");
const router = new koa_router_1.default({ prefix: `/api/products` });
router.post('/products-list', products_list_1.productsList);
router.post('/facet-filters', facet_filters_1.facetFilters);
router.post('/like-products', likes_1.getLikes);
exports.init = (app) => app.use(router.routes());
