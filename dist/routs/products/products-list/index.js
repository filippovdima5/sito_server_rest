"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_normalization_1 = require("../../../helpers/query-normalization");
const products_1 = require("../../../schemas/products");
const project_fields_1 = require("../../../helpers/project-fields");
const set_sort_1 = require("./helpers/set-sort");
const record_to_cache_key_1 = require("../../../helpers/record-to-cache-key");
const lru_1 = __importDefault(require("lru"));
const create_cache_1 = require("../../../helpers/create-cache");
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
const productsListLRU = new lru_1.default({ max: 10, maxAge: 60 * 1000 });
const cacheRender = create_cache_1.createCache(productsListLRU);
async function renderProductsList(finalParams) {
    const { sex_id, brands, categories, colors, limit, page, sizes, sort, price_from, price_to, sale_from, sale_to } = finalParams;
    const $skip = (page - 1) * limit;
    const $sort = set_sort_1.setSort(sort);
    const query = {
        sex_id: { $in: [0, sex_id] },
        price: { $gte: price_from, $lte: price_to },
        sale: { $gte: sale_from, $lte: sale_to },
    };
    if (brands)
        query.brand = { $in: brands };
    if (categories)
        query.category_id = { $in: categories };
    if (colors)
        query.color = { $in: colors };
    if (sizes)
        query.size = { $in: sizes };
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
    return await products_1.Products
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
            return { products: [], info: { total: 0, total_pages: 0 } };
        }
        return result;
    });
}
async function productsList(ctx) {
    const finalParams = query_normalization_1.queryNormalization(ctx.request.body, defaultParams, requiredFields);
    const cacheKey = record_to_cache_key_1.recordToCacheKey(finalParams);
    ctx.body = await cacheRender(() => renderProductsList(finalParams), cacheKey, () => ({ products: [], info: { total: 0, total_pages: 0 } }))();
}
exports.productsList = productsList;
