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
const mongoose_1 = require("mongoose");
const mongoose_2 = require("../libs/mongoose");
const userScheme = new mongoose_1.Schema({
    sex_id: {
        type: Number,
        enum: [1, 2, 0]
    },
    likes: {
        type: [String],
    }
}, {
    timestamps: true
});
userScheme.statics.getIdUser = function getIdUser(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const cookie = ctx.cookies.get('user');
        console.log(cookie);
        if (cookie) {
            const checkUser = yield exports.User.findOne({ _id: cookie });
            if (Boolean(checkUser))
                return cookie;
        }
        const newUser = new exports.User({});
        return newUser.save()
            .then(res => {
            ctx.cookies.set('user', res._id, { httpOnly: true, maxAge: 9999999999999 });
            return res._id;
        });
    });
};
exports.User = mongoose_2.mongoose.model('User', userScheme);
