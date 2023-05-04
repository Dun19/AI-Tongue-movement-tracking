"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newKnex = void 0;
const knex_1 = __importDefault(require("knex"));
const env_1 = require("./env");
function newKnex() {
    let config = require("./knexfile");
    let profile = config[env_1.env.NODE_ENV];
    let knex = (0, knex_1.default)(profile);
    return knex;
}
exports.newKnex = newKnex;
