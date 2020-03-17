"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const products_1 = require("../../schemas/products");
const create_cache_1 = require("../../helpers/create-cache");
const lru_1 = __importDefault(require("lru"));
const allBrandsLRU = new lru_1.default({ max: 10, maxAge: 10 * 60 * 1000 });
const cacheRender = create_cache_1.createCache(allBrandsLRU);
async function renderAllBrands({ sexId }) {
    return await products_1.Products.aggregate([
        { $match: { sex_id: { $in: [sexId, 0] } } },
        { $group: {
                _id: "$brand",
                count: { $sum: 1 }
            } }
    ])
        .then(res => res.filter(item => (item.count > 10 && Boolean(item._id))))
        .then(res => {
        let c = (a) => 10 > a ? 2e4 + +a : a.charCodeAt(0);
        return res.sort((a, b) => c(a._id.charAt(0)) - c(b._id.charAt(0)));
    })
        .then(res => {
        const arr = [];
        if (res.length === 0)
            return [];
        let currentChar = res[0]._id.charAt(0);
        arr.push({
            char: currentChar,
            brands: [res[0]]
        });
        res.forEach(({ _id, count }, index) => {
            if (index === 0)
                return;
            if (currentChar.toLowerCase() === _id.charAt(0).toLowerCase()) {
                arr[arr.length - 1].brands.push({ _id, count });
            }
            else {
                arr.push({ char: _id.charAt(0), brands: [{ count, _id }] });
                currentChar = _id.charAt(0);
            }
        });
        return arr;
    });
}
async function allBrands(ctx) {
    const query = ctx.request.query;
    let sexId;
    switch (query.sexId) {
        case '1':
        case '2':
            sexId = Number(query.sexId);
            break;
        default: throw Error('Не верный gender');
    }
    const cacheKey = sexId.toString();
    ctx.body = await cacheRender(() => renderAllBrands({ sexId }), cacheKey, () => [])();
}
exports.allBrands = allBrands;
