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
const typeorm_1 = require("typeorm");
const Category_1 = require("../entity/Category");
const Common_1 = require("./Common");
class CategoryController {
    constructor() {
        this.useCategory = (0, typeorm_1.getRepository)(Category_1.default);
    }
    one(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const category = yield this.useCategory.findOne(id, { relations: ["blogs"] });
            return (0, Common_1.sendData)(category);
        });
    }
    save(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const categoryObj = Category_1.default.transform(req.body);
            const errors = yield categoryObj.validateThis();
            if (errors.length) {
                return (0, Common_1.sendError)(errors.join("; "));
            }
            const categoryIns = yield this.useCategory.save(categoryObj);
            categoryIns.blogs = [];
            return (0, Common_1.sendData)(categoryIns);
        });
    }
    remove(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const category = yield this.useCategory.findOne(id, { relations: ["blogs"] });
            if (!category) {
                return (0, Common_1.sendError)("不存在id为" + id + "的分类");
            }
            if (category.blogs.length) {
                return (0, Common_1.sendError)("分类所属博客不为空，不能删除");
            }
            yield this.useCategory.delete({ id });
            return (0, Common_1.sendData)(true);
        });
    }
    all(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield this.useCategory.find({ relations: ["blogs"] });
            return (0, Common_1.sendData)(categories);
        });
    }
}
exports.default = CategoryController;
//# sourceMappingURL=CategoryController.js.map