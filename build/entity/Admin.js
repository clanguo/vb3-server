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
exports.Admin = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const Base_1 = require("./Base");
let Admin = class Admin extends Base_1.default {
    static transform(obj) {
        return super.baseTransform(this, obj);
    }
};
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "账户名不能为空" }),
    (0, class_validator_1.MinLength)(3, { message: "账户名不能小于三位字符" }),
    (0, class_validator_1.MaxLength)(10, { message: "账户名不能大于10个字符" }),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9@]{3,10}$/, { message: "账户名只能是字母、数字、@等组合" }),
    (0, class_transformer_1.Type)(() => String),
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Admin.prototype, "account", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "密码不能为空" }),
    (0, class_validator_1.MinLength)(4, { message: "密码长度不能小于4" }),
    (0, class_validator_1.MaxLength)(16, { message: "密码长度不能大于16" }),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9@]{3,10}$/, { message: "密码只能是字母、数字、@等组合" }),
    (0, class_transformer_1.Type)(() => String),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Admin.prototype, "password", void 0);
Admin = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(["account"])
], Admin);
exports.Admin = Admin;
//# sourceMappingURL=Admin.js.map