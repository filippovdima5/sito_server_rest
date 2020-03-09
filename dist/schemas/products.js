"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_2 = require("../libs/mongoose");
const productsScheme = new mongoose_1.Schema({
    id: String,
    title: String,
    description: String,
    category_id: Number,
    brand: String,
    size: String,
    color: String,
    price: Number,
    oldprice: Number,
    sale: Number,
    img: [String],
    url: String
}, {
    timestamps: true
});
exports.Products = mongoose_2.mongoose.model('Products', productsScheme);
