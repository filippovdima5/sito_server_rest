"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_normalization_1 = require("../../../helpers/query-normalization");
const set_facet_1 = require("./helpers/set-facet");
const products_1 = require("../../../schemas/products");
const object_without_fields_1 = require("../../../helpers/object-without-fields");
const compare_results_1 = require("./helpers/compare-results");
const record_to_cache_key_1 = require("../../../helpers/record-to-cache-key");
const lru_1 = __importDefault(require("lru"));
const create_cache_1 = require("../../../helpers/create-cache");
const requiredFields = ['sex_id'];
const defaultParams = {
    price_from: 0,
    price_to: 30000,
    sale_from: 30,
    sale_to: 99,
    favorite: 0
};
async function renderFiltersWithoutParams({ sexId }) {
    return await products_1.Products
        .aggregate([
        { $match: { sex_id: { $in: [0, sexId] } } },
        { $facet: {
                categories: set_facet_1.setFacetItem('category_id'),
                brands: set_facet_1.setFacetItem('brand'),
                sizes: set_facet_1.setFacetArrow('size'),
                colors: set_facet_1.setFacetArrow('color'),
            } }
    ])
        .then(res => res[0]);
}
async function renderFiltersWithParams(finalParams, firstRes) {
    const { sex_id, brands, categories, sizes, colors, price_from, price_to, sale_from, sale_to } = finalParams;
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
    const nextRes = await Promise.all([
        products_1.Products.find(object_without_fields_1.objectWithoutFields(query, ['category_id'])).distinct('category_id'),
        products_1.Products.find(object_without_fields_1.objectWithoutFields(query, ['brand'])).distinct('brand'),
        products_1.Products.find(object_without_fields_1.objectWithoutFields(query, ['size'])).distinct('size'),
        products_1.Products.find(object_without_fields_1.objectWithoutFields(query, ['color'])).distinct('color'),
        products_1.Products.find(object_without_fields_1.objectWithoutFields(query, ['price'])).sort({ price: 1 }).limit(1),
        products_1.Products.find(object_without_fields_1.objectWithoutFields(query, ['price'])).sort({ price: -1 }).limit(1),
        products_1.Products.find(object_without_fields_1.objectWithoutFields(query, ['sale'])).sort({ sale: 1 }).limit(1),
        products_1.Products.find(object_without_fields_1.objectWithoutFields(query, ['sale'])).sort({ sale: -1 }).limit(1),
    ])
        .then(res => {
        return {
            categories: res[0],
            brands: res[1],
            sizes: res[2],
            colors: res[3],
            price_from: res[4][0] ? res[4][0].price : defaultParams.price_from,
            price_to: res[5][0] ? res[5][0].price : defaultParams.price_to,
            sale_from: res[6][0] ? res[6][0].sale : defaultParams.sale_from,
            sale_to: res[7][0] ? res[7][0].sale : defaultParams.sale_to
        };
    });
    return ({
        categories: compare_results_1.compareResults(firstRes.categories, nextRes.categories),
        brands: compare_results_1.compareResults(firstRes.brands, nextRes.brands),
        sizes: compare_results_1.compareResults(firstRes.sizes, nextRes.sizes),
        colors: compare_results_1.compareResults(firstRes.colors, nextRes.colors),
        price_from: nextRes.price_from,
        price_to: nextRes.price_to,
        sale_from: nextRes.sale_from,
        sale_to: nextRes.sale_to,
    });
}
const withoutParamsLRU = new lru_1.default({ max: 10, maxAge: 3 * 60 * 1000 });
const cacheRenderOut = create_cache_1.createCache(withoutParamsLRU);
const withParamsLRU = new lru_1.default({ max: 10, maxAge: 2 * 60 * 1000 });
const cacheRenderWith = create_cache_1.createCache(withParamsLRU);
async function facetFilters(ctx) {
    const finalParams = query_normalization_1.queryNormalization(ctx.request.body, defaultParams, requiredFields);
    const cacheKeyWithoutParams = finalParams.sex_id.toString();
    const firstRes = await cacheRenderOut(() => renderFiltersWithoutParams({ sexId: finalParams.sex_id }), cacheKeyWithoutParams)();
    const cacheKeyWithParams = record_to_cache_key_1.recordToCacheKey(finalParams);
    ctx.body = await cacheRenderWith(() => renderFiltersWithParams(finalParams, firstRes), cacheKeyWithParams)();
}
exports.facetFilters = facetFilters;
