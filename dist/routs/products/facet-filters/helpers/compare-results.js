"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function compareResults(first, next) {
    return first.map(item => {
        if (next.includes(item.value))
            return Object.assign(Object.assign({}, item), { available: true });
        else
            return Object.assign(Object.assign({}, item), { available: false });
    });
}
exports.compareResults = compareResults;
