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
const lru_cache_1 = __importDefault(require("lru-cache"));
const get_cache_1 = require("../../../helpers/get-cache");
const set_facet_1 = require("./helpers/set-facet");
const products_1 = require("../../../schemas/products");
const object_without_fields_1 = require("../../../helpers/object-without-fields");
const compare_results_1 = require("./helpers/compare-results");
const requiredFields = ['sex_id'];
const defaultParams = {
    price_from: 0,
    price_to: 30000,
    sale_from: 30,
    sale_to: 99,
    favorite: 0
};
const lruFirst = new lru_cache_1.default({ max: 500, maxAge: 3 * 60 * 1000 });
const lruNext = new lru_cache_1.default({ max: 100, maxAge: 10 * 1000 });
function facetFilters(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const finalParams = query_normalization_1.queryNormalization(ctx.request.body, defaultParams, requiredFields);
        const { sex_id, brands, categories, sizes, colors, price_from, price_to, sale_from, sale_to } = finalParams;
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
        let firstRes;
        let nextRes;
        try {
            firstRes = get_cache_1.getCache(lruFirst, sex_id);
        }
        catch (e) {
            firstRes = yield products_1.Products
                .aggregate([
                { $match: { sex_id: { $in: [0, sex_id] } } },
                { $facet: {
                        categories: set_facet_1.setFacetItem('category_id'),
                        brands: set_facet_1.setFacetItem('brand'),
                        sizes: set_facet_1.setFacetArrow('size'),
                        colors: set_facet_1.setFacetArrow('color'),
                    } }
            ])
                .then(res => {
                lruFirst.set(sex_id, res[0]);
                return res[0];
            });
        }
        try {
            nextRes = get_cache_1.getCache(lruNext, finalParams);
        }
        catch (e) {
            nextRes = yield Promise.all([
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
            })
                .then(res => {
                lruNext.set(JSON.stringify(finalParams), res);
                return res;
            });
        }
        ctx.body = {
            categories: compare_results_1.compareResults(firstRes.categories, nextRes.categories),
            brands: compare_results_1.compareResults(firstRes.brands, nextRes.brands),
            sizes: compare_results_1.compareResults(firstRes.sizes, nextRes.sizes),
            colors: compare_results_1.compareResults(firstRes.colors, nextRes.colors),
            price_from: nextRes.price_from,
            price_to: nextRes.price_to,
            sale_from: nextRes.sale_from,
            sale_to: nextRes.sale_to,
        };
    });
}
exports.facetFilters = facetFilters;
