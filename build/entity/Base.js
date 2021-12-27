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
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
class Base {
    static baseTransform(cls, planObject) {
        if (planObject instanceof cls) {
            return planObject;
        }
        else {
            return (0, class_transformer_1.plainToInstance)(cls, planObject);
        }
    }
    validateThis(skipMissingProperties = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = yield (0, class_validator_1.validate)(this, { skipMissingProperties });
            return errors.flatMap(error => Object.values(error.constraints).map(e => `【${error.property}】${e}`));
        });
    }
}
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], Base.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], Base.prototype, "updatedAt", void 0);
exports.default = Base;
//# sourceMappingURL=Base.js.map