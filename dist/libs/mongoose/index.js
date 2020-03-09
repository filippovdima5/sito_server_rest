"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.mongoose = mongoose_1.default;
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
const config_1 = __importDefault(require("config"));
mongoose_1.default.set('debug', config_1.default.get('mongodb.debug'));
mongoose_1.default.plugin(mongoose_beautiful_unique_validation_1.default);
mongoose_1.default.connect(config_1.default.get('mongodb.uri'), { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, useCreateIndex: true });
