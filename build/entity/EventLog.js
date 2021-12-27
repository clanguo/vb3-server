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
exports.EventType = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const Base_1 = require("./Base");
var EventType;
(function (EventType) {
    EventType[EventType["addBlog"] = 0] = "addBlog";
    EventType[EventType["removeBlog"] = 1] = "removeBlog";
    EventType[EventType["addTag"] = 2] = "addTag";
    EventType[EventType["removeTag"] = 3] = "removeTag";
    EventType[EventType["startServer"] = 4] = "startServer";
})(EventType = exports.EventType || (exports.EventType = {}));
let EventLog = class EventLog extends Base_1.default {
    constructor() {
        super(...arguments);
        this.targetId = "";
    }
    static transform(obj) {
        return super.baseTransform(this, obj);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], EventLog.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "事件时间点不能为空" }),
    (0, class_transformer_1.Type)(() => Date),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], EventLog.prototype, "timing", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "事件类型不能为空" }),
    (0, class_transformer_1.Type)(() => Number),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], EventLog.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "事件对象不能为空" }),
    (0, class_transformer_1.Type)(() => String),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EventLog.prototype, "target", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => String),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EventLog.prototype, "targetId", void 0);
EventLog = __decorate([
    (0, typeorm_1.Entity)()
], EventLog);
exports.default = EventLog;
//# sourceMappingURL=EventLog.js.map