"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_logger_1 = __importDefault(require("koa-logger"));
exports.init = (app) => {
    return app.use(koa_logger_1.default());
};
