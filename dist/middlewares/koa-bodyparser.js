"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
exports.init = (app) => app.use(koa_bodyparser_1.default({
    jsonLimit: '56kb',
}));
