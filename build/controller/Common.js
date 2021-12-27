"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPageError = exports.sendPageData = exports.sendError = exports.sendData = void 0;
function sendData(data) {
    return {
        err: null,
        data
    };
}
exports.sendData = sendData;
function sendError(err) {
    return {
        err,
        data: null
    };
}
exports.sendError = sendError;
function sendPageData(data, count, limit, page, key) {
    return {
        data,
        err: null,
        count,
        limit,
        page,
        key
    };
}
exports.sendPageData = sendPageData;
function sendPageError(err) {
    return {
        data: null,
        err,
        count: 0
    };
}
exports.sendPageError = sendPageError;
//# sourceMappingURL=Common.js.map