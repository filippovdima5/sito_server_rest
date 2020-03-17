"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const seos_1 = require("../../schemas/seos");
const lib_1 = require("./lib");
const create_cache_1 = require("../../helpers/create-cache");
const record_to_cache_key_1 = require("../../helpers/record-to-cache-key");
const lru_1 = __importDefault(require("lru"));
const defaultSeo = {
    title: 'SITO - сайт выгодных скидок. Каталог акций в интернет-магазинах.',
    description: 'Все скидки рунета на SITO: поиск выгодных цен на одежду, обувь и аксессуары в интернет-магазинах. Агрегатор скидок – акции от 50%'
};
const seoLRU = new lru_1.default({ max: 10, maxAge: 30 * 60 * 1000 });
const cacheRender = create_cache_1.createCache(seoLRU);
async function renderSeo({ sexId, path, search }) {
    try {
        const pathname = lib_1.findPathname(path);
        const sex = sexId === null ? 0 : sexId;
        let category = 0;
        let subcategory = 0;
        const categories = lib_1.findCategory(search);
        if (categories.length === 1)
            category = categories[0];
        if (categories.length > 1) {
            const subs = categories.map(item => (Math.trunc(item)));
            const setSub = new Set([...subs]);
            const arrSub = Array.from(setSub);
            if (arrSub.length === 1)
                subcategory = arrSub[0] * 1000;
        }
        return await seos_1.Seo.findOne({ pathname, sex, category, subcategory: Math.trunc(subcategory / 1000) })
            .then(res => {
            if (res === null)
                return defaultSeo;
            else
                return { title: res.title, description: res.description };
        });
    }
    catch (e) {
        return defaultSeo;
    }
}
async function getSeo(ctx) {
    const body = ctx.request.body;
    const sexId = body.sexId;
    const path = body.path;
    const search = body.search;
    const cacheKey = record_to_cache_key_1.recordToCacheKey({ sexId, path, search });
    ctx.body = await cacheRender(() => renderSeo({ sexId, path, search }), cacheKey)();
    if (ctx.status !== 200) {
        seoLRU.remove(cacheKey);
    }
}
exports.getSeo = getSeo;
