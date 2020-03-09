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
const lru_cache_1 = __importDefault(require("lru-cache"));
const get_cache_1 = require("../../../helpers/get-cache");
const translit_rus_to_latin_1 = require("./helpers/translit-rus-to-latin");
const products_1 = require("../../../schemas/products");
const query_normalization_1 = require("../../../helpers/query-normalization");
const requiredFields = ['phrase', 'sex_id'];
const lru = new lru_cache_1.default({ max: 100, maxAge: 20 * 1000 });
function mainSearch(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const finalParams = query_normalization_1.queryNormalization(ctx.request.body, {}, requiredFields);
        const { sex_id, phrase } = finalParams;
        const sexQuery = (sex_id === 0) ? [0, 1, 2] : [0, sex_id];
        const phraseQuery = [phrase, translit_rus_to_latin_1.translRusToLatin(phrase)]
            .map(item => (new RegExp(item, 'i')));
        try {
            ctx.body = get_cache_1.getCache(lru, finalParams);
            return null;
        }
        catch (e) {
            return yield products_1.Products.aggregate([
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
            })
                .then(res => {
                ctx.body = res;
                lru.set(JSON.stringify(finalParams), res);
            });
        }
    });
}
exports.mainSearch = mainSearch;
