"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../../schemas/user");
const hide_special_fields_1 = require("../../libs/hide-special-fields");
async function userGet(ctx) {
    const userId = await user_1.User.getIdUser(ctx);
    ctx.body = await user_1.User.findOne({ _id: userId }, hide_special_fields_1.hideSpecialFields);
}
exports.userGet = userGet;
