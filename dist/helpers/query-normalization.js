"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_error_1 = require("./error-handler/create-error");
function queryNormalization(reqParams, defaultParams, requiredParams) {
    const missingKeys = [];
    requiredParams.forEach(field => {
        if (reqParams[field] === undefined)
            missingKeys.push(field);
    });
    if (missingKeys.length > 0)
        create_error_1.createError({ message: `Не переданы обязательные параметры: ${missingKeys.join(', ')}`, status: 400 });
    return Object.assign(Object.assign({}, defaultParams), reqParams);
}
exports.queryNormalization = queryNormalization;
