"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = ({ message, status }) => {
    const error = new Error(message);
    error.status = (status !== null && status !== void 0 ? status : 500);
    throw error;
};
