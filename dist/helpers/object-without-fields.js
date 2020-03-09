"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function objectWithoutFields(object, excludedFields) {
    const newObj = {};
    Object.keys(object).forEach(key => {
        if (excludedFields.includes(key))
            return;
        newObj[key] = object[key];
    });
    return newObj;
}
exports.objectWithoutFields = objectWithoutFields;
