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
exports.TagController = void 0;
const typeorm_1 = require("typeorm");
const EventLog_1 = require("../entity/EventLog");
const Tag_1 = require("../entity/Tag");
const Common_1 = require("./Common");
const ProjectController_1 = require("./ProjectController");
class TagController {
    constructor() {
        this.useTag = (0, typeorm_1.getRepository)(Tag_1.Tag);
    }
    add(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const tag = Tag_1.Tag.transform(req.body);
            /**
             * 添加tag时不添加blog
             */
            delete tag.blogs;
            const errors = yield tag.validateThis();
            if (errors.length) {
                return (0, Common_1.sendError)(errors.join("; "));
            }
            const tagIns = yield this.useTag.save(tag);
            new ProjectController_1.default().addEventLog({
                timing: new Date(), type: EventLog_1.EventType.addTag, target: tagIns.name, targetId: tagIns.id
            });
            tag.blogs = [];
            return (0, Common_1.sendData)(tagIns);
        });
    }
    find(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const tag = yield this.useTag.findOne(id, { relations: ["blogs"] });
            if (tag) {
                return (0, Common_1.sendData)(tag);
            }
            else {
                return (0, Common_1.sendError)("Not Data with `id` :" + id + " was found!");
            }
        });
    }
    all(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const tags = yield this.useTag.find({ relations: ["blogs"], order: { createdAt: "DESC" } });
            return (0, Common_1.sendData)(tags);
        });
    }
    remove(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const tagIns = yield this.useTag.findOne(id);
            if (tagIns) {
                new ProjectController_1.default().addEventLog({
                    timing: new Date(), type: EventLog_1.EventType.removeTag, target: tagIns.name, targetId: tagIns.id
                });
                yield this.useTag.remove(tagIns);
                return (0, Common_1.sendData)(true);
            }
            else {
                return (0, Common_1.sendData)(false);
            }
        });
    }
    // 解除tag和blog之间的关联
    unLink(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const tagId = req.params.id;
            const blogId = req.body.id;
            const tag = yield this.useTag.findOne(tagId, { relations: ["blogs"] });
            tag.blogs = tag.blogs.filter(blog => blog.id !== blogId);
            yield this.useTag.save(tag);
            return (0, Common_1.sendData)(true);
        });
    }
}
exports.TagController = TagController;
//# sourceMappingURL=TagController.js.map