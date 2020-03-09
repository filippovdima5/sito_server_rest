"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_session_1 = __importDefault(require("koa-session"));
exports.init = (app) => {
    app.keys = ['SECRET'];
    return app.use(koa_session_1.default({
        key: 'sito:sess',
        rolling: true,
        signed: false
    }, app));
};
