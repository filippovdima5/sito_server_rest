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
const seos_1 = require("./schemas/seos");
let startParse = false;
const keys = {
    4006: 1001,
    1006: 1001,
    1005: 1002,
    4004: 1003,
    1004: 1003,
    1008: 1004,
    4008: 1004,
    4007: 1005,
    1007: 1005,
    4011: 1006,
    4001: 1007,
    1012: 1007,
    4002: 1010,
    1001: 1010,
    4003: 1011,
    1003: 1011,
    4009: 1012,
    1009: 1012,
    1010: 1013,
    4010: 1013,
    5001: 2001,
    2001: 2001,
    5002: 2002,
    2002: 2002,
    5003: 2003,
    2003: 2003,
    2005: 2005,
    3005: 3002,
    6001: 3004,
    3001: 3004,
    6002: 3005,
    3002: 3005,
    6006: 3007,
    3006: 3008,
    6008: 3009,
    6007: 3011,
    3007: 3011
};
function start() {
    const cursor = seos_1.Seo.find({}).cursor();
    cursor.on('data', (doc) => __awaiter(this, void 0, void 0, function* () {
        cursor.pause();
        let { _id, category, sex, subcategory } = doc;
        const newDoc = {};
        if (!category)
            newDoc.category = 0;
        if (!sex)
            newDoc.sex = 0;
        if (!subcategory)
            newDoc.subcategory = 0;
        try {
            yield seos_1.Seo.findOneAndUpdate({ _id: _id }, newDoc, { upsert: false });
        }
        catch (e) {
            console.log(e.message);
        }
        cursor.resume();
    }));
}
start();
