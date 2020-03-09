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
const user_1 = require("../../../schemas/user");
const libs_1 = require("../../../libs");
function userSet(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = yield user_1.User.getIdUser(ctx);
        yield user_1.User.findOneAndUpdate({ _id: userId }, ctx.request.body);
        ctx.body = libs_1.sendOk();
    });
}
exports.userSet = userSet;
