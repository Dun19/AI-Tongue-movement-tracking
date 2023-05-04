"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TongueController = void 0;
const httpController_1 = require("./httpController");
const formidable_1 = __importDefault(require("formidable"));
class TongueController extends httpController_1.HttpController {
    constructor(tongueService) {
        super();
        this.tongueService = tongueService;
        this.postTongueImage = (req) => {
            const uploadDir = "uploads";
            const form = (0, formidable_1.default)({
                uploadDir,
                keepExtensions: true,
                maxFiles: 1,
                maxFileSize: 1024 ** 2 * 200,
                filter: (part) => { var _a; return ((_a = part.mimetype) === null || _a === void 0 ? void 0 : _a.startsWith("image/")) || false; },
            });
            return this.tongueService.postTongueImage(form, req);
        };
        this.router.post("/diagnosis", this.wrapMethod(this.postTongueImage));
    }
}
exports.TongueController = TongueController;
