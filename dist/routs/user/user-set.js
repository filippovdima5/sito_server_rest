"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../../schemas/user");
const libs_1 = require("../../libs");
async function userSet(ctx) {
    const userId = await user_1.User.getIdUser(ctx);
    await user_1.User.findOneAndUpdate({ _id: userId }, ctx.request.body);
    ctx.body = libs_1.sendOk();
}
exports.userSet = userSet;
