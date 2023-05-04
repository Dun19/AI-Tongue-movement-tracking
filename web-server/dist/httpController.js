"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpController = void 0;
const express_1 = require("express");
class HttpController {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    wrapMethod(fn) {
        return async (req, res, next) => {
            try {
                let json = await fn(req);
                res.json(json);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.HttpController = HttpController;
