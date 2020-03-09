"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCache = (lru, keyCache) => {
    const key = typeof keyCache === 'object' ? JSON.stringify(keyCache) : keyCache;
    const res = lru.get(key);
    if (res)
        return res;
    else
        throw Error('Кеша нет');
};
