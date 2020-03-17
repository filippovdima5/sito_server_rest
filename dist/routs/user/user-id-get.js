"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../../schemas/user");
const hide_special_fields_1 = require("../../libs/hide-special-fields");
async function userIdGet(ctx) {
    const { id } = ctx.query;
    if (!Boolean(id)) {
        ctx.body = {};
        return;
    }
    const user = await user_1.User.findOne({ _id: id }, hide_special_fields_1.hideSpecialFields);
    if (Boolean(user)) {
        ctx.body = user;
    }
    else {
        ctx.body = {};
    }
}
exports.userIdGet = userIdGet;
