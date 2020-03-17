"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCache = (lru) => ((fetch, name, handleError) => async () => {
    try {
        let result = lru.get(name);
        if (result === undefined) {
            const resultResponse = await fetch();
            result = lru.set(name, resultResponse);
        }
        return result;
    }
    catch (error) {
        if (handleError) {
            return handleError(error);
        }
        console.error(`cache '${name}' error \n`, error);
        throw error;
    }
});
