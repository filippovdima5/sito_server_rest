"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("./error-handler");
function queryNormalization(reqParams, defaultParams, requiredParams) {
    const missingKeys = [];
    requiredParams.forEach(field => {
        if (reqParams[field] === undefined)
            missingKeys.push(field);
    });
    if (missingKeys.length > 0)
        error_handler_1.errorHandler({ message: `Не переданы обязательные параметры: ${missingKeys.join(', ')}`, status: 400 });
    return Object.assign(Object.assign({}, defaultParams), reqParams);
}
exports.queryNormalization = queryNormalization;
