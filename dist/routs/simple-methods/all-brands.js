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
Object.defineProperty(exports, "__esModule", { value: true });
const products_1 = require("../../schemas/products");
function allBrands(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = ctx.request.query;
        let sexId;
        switch (query.sexId) {
            case '1':
            case '2':
                sexId = Number(query.sexId);
                break;
            default: throw Error('Не верный gender');
        }
        return yield products_1.Products.aggregate([
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
        })
            .then(res => {
            ctx.body = res;
        });
    });
}
exports.allBrands = allBrands;
