"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsController = void 0;
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.resolve(__dirname, "../public/uploads"));
    },
    filename(req, file, cb) {
        const uniqueSuffix = Date.now().toString().substr(5) + '_' + Math.round(Math.random() * 1E9);
        const extname = path.extname(file.originalname);
        cb(null, uniqueSuffix + extname);
    }
});
const whiteExtendName = [".png", '.jpg', '.jpeg', '.gif'];
const uploadStorage = multer({
    storage,
    limits: {
        fileSize: 10485760
    },
    fileFilter(req, file, cb) {
        const extname = path.extname(file.originalname);
        if (whiteExtendName.includes(extname)) {
            cb(null, true);
        }
        else {
            cb(new Error(`不接受扩展名为${extname}的文件`));
        }
    }
});
class UploadsController {
    poster(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return uploadStorage.single("poster")(req, res, next);
        });
    }
}
exports.UploadsController = UploadsController;
//# sourceMappingURL=UploadsController.js.map