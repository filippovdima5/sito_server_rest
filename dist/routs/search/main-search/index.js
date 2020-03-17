"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const record_to_cache_key_1 = require("../../../helpers/record-to-cache-key");
const libs_1 = require("../../../libs");
const products_1 = require("../../../schemas/products");
const query_normalization_1 = require("../../../helpers/query-normalization");
const lru_1 = __importDefault(require("lru"));
const create_cache_1 = require("../../../helpers/create-cache");
const requiredFields = ['phrase', 'sex_id'];
const mainSearchLRU = new lru_1.default({ max: 10, maxAge: 60 * 1000 });
const cacheRender = create_cache_1.createCache(mainSearchLRU);
async function renderMainSearch({ sex_id, phrase }) {
    const sexQuery = (sex_id === 0) ? [0, 1, 2] : [0, sex_id];
    const phraseQuery = [phrase, libs_1.translRusToLatin(phrase)]
        .map(item => (new RegExp(item, 'i')));
    return await products_1.Products.aggregate([
        { $match: { sex_id: { $in: sexQuery } } },
        { $facet: {
                brands: [
                    { $match: { brand: { $in: phraseQuery } } },
                    { $group: { _id: "$brand", count: { $sum: 1 } } },
                    { $project: { title: "$_id", count: "$count", type: 'brand', _id: 0 } },
                ]
            } },
    ])
        .then(res => {
        return [...res[0].brands];
    });
}
async function mainSearch(ctx) {
    const finalParams = query_normalization_1.queryNormalization(ctx.request.body, {}, requiredFields);
    const cacheKey = record_to_cache_key_1.recordToCacheKey(finalParams);
    ctx.body = await cacheRender(() => renderMainSearch(finalParams), cacheKey, () => [])();
}
exports.mainSearch = mainSearch;
