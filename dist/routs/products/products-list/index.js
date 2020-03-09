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
const query_normalization_1 = require("../../../helpers/query-normalization");
const products_1 = require("../../../schemas/products");
const lru_cache_1 = __importDefault(require("lru-cache"));
const get_cache_1 = require("../../../helpers/get-cache");
const project_fields_1 = require("../../../helpers/project-fields");
const set_sort_1 = require("./helpers/set-sort");
const requiredFields = ['sex_id'];
const defaultParams = {
    page: 1,
    sort: 'update_up',
    limit: 20,
    price_from: 0,
    price_to: 30000,
    sale_from: 30,
    sale_to: 99,
    favorite: 0
};
const responseField = ['id', 'title', 'url', 'img', 'brand', 'price', 'oldprice', 'sale'];
const lru = new lru_cache_1.default({ max: 100, maxAge: 60 * 1000 });
function productsList(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const finalParams = query_normalization_1.queryNormalization(ctx.request.body, defaultParams, requiredFields);
        const { sex_id, brands, categories, colors, limit, page, sizes, sort, price_from, price_to, sale_from, sale_to } = finalParams;
        try {
            ctx.body = get_cache_1.getCache(lru, finalParams);
            return null;
        }
        catch (e) {
            const $skip = (page - 1) * limit;
            const $sort = set_sort_1.setSort(sort);
            const query = {
                sex_id: { $in: [0, sex_id] },
                price: { $gte: price_from, $lte: price_to },
                sale: { $gte: sale_from, $lte: sale_to },
            };
            if (brands) {
                query.brand = { $in: brands };
            }
            if (categories) {
                query.category_id = { $in: categories };
            }
            if (colors) {
                query.color = { $in: colors };
            }
            if (sizes) {
                query.size = { $in: sizes };
            }
            const paginate_info = [
                { $group: { _id: null, count: { $sum: 1 } } },
                {
                    $project: {
                        _id: 0,
                        total: "$count",
                        total_pages: { $ceil: { $divide: ["$count", limit] } },
                    }
                }
            ];
            return yield products_1.Products
                .aggregate([
                { $match: query },
                {
                    $facet: {
                        products: [
                            { $sort },
                            { $skip },
                            { $limit: limit },
                            { $project: project_fields_1.projectFields(responseField) }
                        ],
                        info: paginate_info
                    }
                }
            ])
                .then(res => {
                let result = {
                    products: res[0].products,
                    info: res[0].info[0]
                };
                if (result.products.length === 0) {
                    ctx.body = { products: [], info: { total: 0, total_pages: 0 } };
                    lru.set(JSON.stringify(finalParams), { products: [], info: { total: 0, total_pages: 0 } });
                    return null;
                }
                ctx.body = result;
                lru.set(JSON.stringify(finalParams), result);
            });
        }
    });
}
exports.productsList = productsList;
