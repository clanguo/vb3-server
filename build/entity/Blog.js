"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const Base_1 = require("./Base");
const BlogContent_1 = require("./BlogContent");
const Category_1 = require("./Category");
const Tag_1 = require("./Tag");
let Blog = class Blog extends Base_1.default {
    constructor() {
        super(...arguments);
        this.poster = "";
        this.description = "";
    }
    static transform(obj) {
        return super.baseTransform(this, obj);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Blog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsNotEmpty)({ message: "标题不能为空" }),
    (0, class_transformer_1.Type)(() => String),
    __metadata("design:type", String)
], Blog.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Type)(() => String),
    __metadata("design:type", String)
], Blog.prototype, "poster", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.MaxLength)(50, { message: "描述不易过长" }),
    (0, class_transformer_1.Type)(() => String),
    __metadata("design:type", String)
], Blog.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.JoinColumn)(),
    (0, typeorm_1.OneToOne)((type) => BlogContent_1.BlogContent, (content) => content.blog),
    __metadata("design:type", BlogContent_1.BlogContent)
], Blog.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.JoinTable)(),
    (0, typeorm_1.ManyToMany)((type) => Tag_1.Tag, (tag) => tag.blogs),
    __metadata("design:type", Array)
], Blog.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => Category_1.default, (category) => category.blogs),
    __metadata("design:type", Category_1.default)
], Blog.prototype, "category", void 0);
Blog = __decorate([
    (0, typeorm_1.Entity)()
], Blog);
exports.Blog = Blog;
//# sourceMappingURL=Blog.js.map