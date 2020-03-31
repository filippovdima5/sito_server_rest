"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const products_1 = require("../../schemas/products");
const create_cache_1 = require("../../helpers/create-cache");
const lru_1 = __importDefault(require("lru"));
const popularBrandsLRU = new lru_1.default({ max: 10, maxAge: 10 * 60 * 1000 });
const cacheRender = create_cache_1.createCache(popularBrandsLRU);
async function renderPopularBrands({ sexId }) {
    const matchSex = sexId !== 'uni' ? { $in: [sexId, 0] } : { $in: [1, 2, 0] };
    return await products_1.Products.aggregate([
        { $match: { sex_id: matchSex } },
        { $group: {
                _id: "$brand",
                count: { $sum: 1 }
            } },
        { $sort: { count: -1 } },
        { $limit: 52 }
    ])
        .then(res => {
        console.log(res);
        let c = (a) => 10 > a ? 2e4 + +a : a.charCodeAt(0);
        return res
            .sort((a, b) => c(a._id) - c(b._id))
            .map(item => item._id);
    });
}
async function popularBrands(ctx) {
    const query = ctx.request.query;
    console.log(query);
    let sexId;
    switch (query.sexId) {
        case '1':
        case '2':
            sexId = Number(query.sexId);
            break;
        default: sexId = 'uni';
    }
    const cacheKey = sexId.toString();
    ctx.body = await cacheRender(() => renderPopularBrands({ sexId }), cacheKey, () => [])();
}
exports.popularBrands = popularBrands;
