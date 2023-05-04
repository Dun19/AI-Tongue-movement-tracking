"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = require("dotenv");
const populate_env_1 = __importDefault(require("populate-env"));
(0, dotenv_1.config)();
exports.env = {
    PORT: 8080,
    NODE_ENV: "",
    DB_HOST: "localhost",
    DB_PORT: 5432,
    DB_NAME: "",
    //for development and production
    DB_USERNAME: "",
    DB_PASSWORD: "",
    //for jest
    TEST_DB_NAME: "",
    TEST_DB_USERNAME: "",
    TEST_DB_PASSWORD: "",
    // for CI
    POSTGRES_DB: "",
    POSTGRES_DB_USER: "",
    POSTGRES_DB_PASSWORD: "",
    POSTGRES_DB_HOST: "",
    POSTGRES_DB_PORT: 5432,
};
if (process.env.NODE_ENV != "test") {
    exports.env.TEST_DB_NAME = "skip";
    exports.env.TEST_DB_USERNAME = "skip";
    exports.env.TEST_DB_PASSWORD = "skip";
}
if (process.env.NODE_ENV != "ci") {
    exports.env.POSTGRES_DB = "skip";
    exports.env.POSTGRES_DB_USER = "skip";
    exports.env.POSTGRES_DB_PASSWORD = "skip";
    exports.env.POSTGRES_DB_HOST = "skip";
}
if (process.env.NODE_ENV == "test" || process.env.NODE_ENV == "ci") {
    exports.env.DB_NAME = "skip";
    exports.env.DB_USERNAME = "skip";
    exports.env.DB_PASSWORD = "skip";
}
(0, populate_env_1.default)(exports.env, { mode: "halt" });
