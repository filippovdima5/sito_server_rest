"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_2 = require("../libs/mongoose");
const seoScheme = new mongoose_1.Schema({
    pathname: {
        type: String,
    },
    sex: {
        type: Number,
        enum: [1, 2, 0]
    },
    category: {
        type: Number
    },
    subcategory: {
        type: Number
    },
    title: String,
    description: String
});
exports.Seo = mongoose_2.mongoose.model('Seo', seoScheme);
