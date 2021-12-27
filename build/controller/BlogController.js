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
exports.BlogController = void 0;
const typeorm_1 = require("typeorm");
const Blog_1 = require("../entity/Blog");
const Common_1 = require("./Common");
const BlogContent_1 = require("../entity/BlogContent");
const Tag_1 = require("../entity/Tag");
const EventLog_1 = require("../entity/EventLog");
const ProjectController_1 = require("./ProjectController");
const SearchCondition_1 = require("../entity/SearchCondition");
class BlogController {
    constructor() {
        this.useBlog = (0, typeorm_1.getRepository)(Blog_1.Blog);
        this.useContent = (0, typeorm_1.getRepository)(BlogContent_1.BlogContent);
        this.useTag = (0, typeorm_1.getRepository)(Tag_1.Tag);
    }
    all(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchCondition = SearchCondition_1.default.transform(request.query);
            const errors = yield searchCondition.validateThis();
            if (errors.length) {
                // return sendError(errors.join("; "));
                return (0, Common_1.sendPageError)(errors.join("; "));
            }
            const blogs = yield this.useBlog.find({
                relations: ["tags", "category"],
                skip: (searchCondition.page - 1) * searchCondition.limit,
                take: searchCondition.limit,
                where: {
                    title: (0, typeorm_1.Like)(`%${searchCondition.key}%`)
                },
                order: {
                    createdAt: "DESC"
                }
            });
            const count = yield this.useBlog.count();
            return (0, Common_1.sendPageData)(blogs, count, searchCondition.limit, searchCondition.page, searchCondition.key);
        });
    }
    one(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.useBlog.findOne(request.params.id, { relations: ["content", "tags", "category"] });
            if (blog) {
                return (0, Common_1.sendData)(blog);
            }
            else {
                return (0, Common_1.sendError)("No Data with `id` :" + request.params.id + " was found");
            }
        });
    }
    save(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentObj = new BlogContent_1.BlogContent(request.body.content);
            const blog = Blog_1.Blog.transform(request.body);
            blog.content = contentObj;
            const contentErrors = yield contentObj.validateThis();
            const blogErrors = yield blog.validateThis(true);
            const errors = blogErrors.concat(contentErrors);
            if (errors.length > 0) {
                return (0, Common_1.sendError)(errors.join("; "));
            }
            else {
                const tags = [];
                for (const tagId of blog.tags) {
                    const tag = yield this.useTag.findOne(tagId);
                    tags.push(tag);
                }
                blog.tags = tags;
                const contentIns = yield this.useContent.save(contentObj);
                blog.content = contentIns;
                const blogIns = yield this.useBlog.save(blog);
                new ProjectController_1.default().addEventLog({
                    timing: new Date(), target: blogIns.title, targetId: blogIns.id, type: EventLog_1.EventType.addBlog
                });
                return (0, Common_1.sendData)(blogIns);
            }
        });
    }
    /**
     * TODO 鉴权
     */
    remove(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let blogIns = yield this.useBlog.findOne(request.params.id, { relations: ["content"] });
            // await this.useContent.remove(userToRemove.)
            if (blogIns) {
                // 不需要等待记录添加就可以直接响应
                new ProjectController_1.default().addEventLog({
                    timing: new Date(), type: EventLog_1.EventType.removeBlog, target: blogIns.title, targetId: blogIns.id
                });
                yield this.useBlog.remove(blogIns);
                yield this.useContent.remove(blogIns.content);
                return (0, Common_1.sendData)(true);
            }
            else {
                return (0, Common_1.sendData)(false);
            }
        });
    }
    editInfo(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = request.params.id;
                const blog = yield this.useBlog.findOne(id);
                if (!blog)
                    return (0, Common_1.sendData)(false);
                const editBlog = request.body;
                for (const key in editBlog) {
                    if (Object.prototype.hasOwnProperty.call(editBlog, key)) {
                        if (key !== "content" && key !== "tags") {
                            blog[key] = editBlog[key];
                        }
                    }
                }
                /**
                 * 防止content被修改
                 */
                delete editBlog.content;
                const errors = yield blog.validateThis();
                if (errors.length > 0) {
                    return (0, Common_1.sendError)(errors.join("; "));
                }
                else {
                    const tags = [];
                    for (const tagId of request.body.tags) {
                        const tag = yield this.useTag.findOne(tagId);
                        tags.push(tag);
                    }
                    blog.tags = tags;
                    yield this.useBlog.save(blog);
                    return (0, Common_1.sendData)(true);
                }
            }
            catch (e) {
                return (0, Common_1.sendError)(e instanceof Error ? e.message : e);
            }
        });
    }
    editContent(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const editContent = new BlogContent_1.BlogContent(request.body.content);
            const errors = yield editContent.validateThis();
            if (errors.length) {
                return (0, Common_1.sendError)(errors.join("; "));
            }
            else {
                let blog = yield this.useBlog.findOne(request.params.id, { relations: ["content"] });
                blog.content.content = editContent.content;
                yield this.useContent.save(blog.content);
                return (0, Common_1.sendData)(true);
            }
        });
    }
}
exports.BlogController = BlogController;
//# sourceMappingURL=BlogController.js.map