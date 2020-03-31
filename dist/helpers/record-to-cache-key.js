"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordToCacheKey = (record) => {
    const arr = Object.entries(record)
        .filter(([_, value]) => (value !== null && value !== undefined && value !== ''))
        .sort((a, b) => (a[0].localeCompare(b[0])));
    return JSON.stringify(arr);
};
