"use strict";
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
userScheme.statics.getIdUser = async function getIdUser(ctx) {
    const cookie = ctx.cookies.get('user');
    console.log(cookie);
    if (cookie) {
        const checkUser = await exports.User.findOne({ _id: cookie });
        if (Boolean(checkUser))
            return cookie;
    }
    const newUser = new exports.User({});
    return newUser.save()
        .then(res => {
        ctx.cookies.set('user', res._id, { httpOnly: true, maxAge: 9999999999999 });
        return res._id;
    });
};
exports.User = mongoose_2.mongoose.model('User', userScheme);
