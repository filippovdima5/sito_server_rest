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
const products_1 = require("../../../schemas/products");
const user_1 = require("../../../schemas/user");
function getLikes(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const idUser = yield user_1.User.getIdUser(ctx);
        let { likes } = ctx.request.body;
        if (likes.length === 0) {
            const userLikes = yield user_1.User.findOne({ _id: idUser })
                .then(res => {
                var _a;
                if (res === null)
                    return [];
                return _a = res.likes, (_a !== null && _a !== void 0 ? _a : []);
            });
            if (userLikes.length > 0)
                likes = userLikes;
            else {
                ctx.body = [];
                return;
            }
        }
        const likeProducts = yield products_1.Products.find({ id: { $in: likes } });
        yield user_1.User.updateOne({ _id: idUser }, { likes: likeProducts.map(item => (item.id)) });
        ctx.body = likeProducts;
    });
}
exports.getLikes = getLikes;
