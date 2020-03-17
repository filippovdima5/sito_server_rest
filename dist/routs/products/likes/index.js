"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const products_1 = require("../../../schemas/products");
const user_1 = require("../../../schemas/user");
async function getLikes(ctx) {
    const idUser = await user_1.User.getIdUser(ctx);
    let { likes } = ctx.request.body;
    if (likes.length === 0) {
        const userLikes = await user_1.User.findOne({ _id: idUser })
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
    const likeProducts = await products_1.Products.find({ id: { $in: likes } });
    await user_1.User.updateOne({ _id: idUser }, { likes: likeProducts.map(item => (item.id)) });
    ctx.body = likeProducts;
}
exports.getLikes = getLikes;
