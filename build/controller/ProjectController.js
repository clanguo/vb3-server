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
const Blog_1 = require("../entity/Blog");
const Category_1 = require("../entity/Category");
const EventLog_1 = require("../entity/EventLog");
const Tag_1 = require("../entity/Tag");
const Common_1 = require("./Common");
class ProjectController {
    constructor() {
        this.useEventLog = (0, typeorm_1.getRepository)(EventLog_1.default);
        this.useBlogs = (0, typeorm_1.getRepository)(Blog_1.Blog);
        this.useTags = (0, typeorm_1.getRepository)(Tag_1.Tag);
        this.useCategory = (0, typeorm_1.getRepository)(Category_1.default);
    }
    addEventLog(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventLog = EventLog_1.default.transform(obj);
            const errors = yield eventLog.validateThis();
            if (errors.length) {
                // throw new Error(errors.join("; "));
                console.error("日志记录失败：" + errors.join("; "));
            }
            else {
                yield this.useEventLog.save(eventLog);
            }
        });
    }
    one(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const eventLogIns = yield this.useEventLog.findOne(id);
            if (eventLogIns) {
                return (0, Common_1.sendData)(eventLogIns);
            }
            else {
                return (0, Common_1.sendError)("No Data with `id` :" + id + " was found");
            }
        });
    }
    all(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventLogs = yield this.useEventLog.find({ order: { timing: "DESC" } });
            return (0, Common_1.sendData)(eventLogs);
        });
    }
    project(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogs = yield this.useBlogs.count();
            const tags = yield this.useTags.count();
            const categories = yield this.useCategory.count();
            return (0, Common_1.sendData)({ blog: blogs, tag: tags, categories });
        });
    }
    archive(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogs = yield this.useEventLog.find({ type: EventLog_1.EventType.addBlog });
            return (0, Common_1.sendData)(blogs);
        });
    }
}
exports.default = ProjectController;
//# sourceMappingURL=ProjectController.js.map