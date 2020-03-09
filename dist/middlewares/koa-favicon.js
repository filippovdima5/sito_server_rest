"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_favicon_1 = __importDefault(require("koa-favicon"));
exports.init = (app) => app.use(koa_favicon_1.default('public/favicon.ico'));
