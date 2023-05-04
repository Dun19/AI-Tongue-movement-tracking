"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const env_1 = require("./env");
// import { userRoute } from "./routes/user.route";
const tongue_route_1 = require("./routes/tongue.route");
const error_1 = require("./error");
const listening_on_1 = require("listening-on");
const knex_1 = require("./knex");
const fs_1 = __importDefault(require("fs"));
const uploadDir = "uploads";
fs_1.default.mkdirSync(uploadDir, { recursive: true });
let app = (0, express_1.default)();
app.use((req, res, next) => {
    let knex = (0, knex_1.newKnex)();
    knex
        .insert({
        method: req.method,
        url: req.url,
        user_agent: req.headers["user-agent"],
    })
        .into("request_log")
        .catch((error) => {
        console.error("failed to insert request_log:", error);
    });
    next();
});
app.use(express_1.default.static("../web-client/public"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// app.use(userRoute);
app.use(tongue_route_1.tongueRoute);
app.use((req, res, next) => {
    next(new error_1.HttpError(404, "route not found"));
});
app.use((error, req, res, next) => {
    res.status(error.statusCode || 500);
    res.json({ error: String(error) });
});
app.listen(env_1.env.PORT, () => {
    (0, listening_on_1.print)(env_1.env.PORT);
});
