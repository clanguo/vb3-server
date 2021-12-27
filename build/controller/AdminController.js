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
exports.AdminController = void 0;
const typeorm_1 = require("typeorm");
const Admin_1 = require("../entity/Admin");
const Auth_1 = require("./Auth");
const Common_1 = require("./Common");
// interface IResponseAdmin extends Required<Exclude<Admin, "password">> { };
class AdminController {
    constructor() {
        this.useAdmin = (0, typeorm_1.getRepository)(Admin_1.Admin);
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = Admin_1.Admin.transform(req.body);
            const errors = yield admin.validateThis();
            if (errors.length) {
                return (0, Common_1.sendError)(errors.join("; "));
            }
            // 检查jwt
            const token = Auth_1.Auth.verify(req);
            if (token) {
                if (token.account === admin.account) {
                    Auth_1.Auth.publish(res, { account: admin.account });
                    return (0, Common_1.sendError)("已登录");
                }
                return (0, Common_1.sendError)("请先退出登录");
            }
            const adminIns = yield this.useAdmin.findOne(admin.account);
            if (adminIns && adminIns.password === admin.password) {
                const data = { account: adminIns.account };
                Auth_1.Auth.publish(res, data);
                return (0, Common_1.sendData)(data);
            }
            else {
                return (0, Common_1.sendError)("账号或密码错误");
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const verifyResult = Auth_1.Auth.verify(req);
            const admin = Admin_1.Admin.transform({ name: verifyResult });
            const errors = yield admin.validateThis(true);
            if (errors.length) {
                return (0, Common_1.sendError)(errors.join("; "));
            }
            // token验证失败
            if (!verifyResult) {
                return (0, Common_1.sendError)("Authentication failed");
            }
            const adminIns = yield this.useAdmin.findOne(admin.account);
            if (adminIns) {
                Auth_1.Auth.remove(res);
                return (0, Common_1.sendData)("成功退出登录");
            }
            return (0, Common_1.sendError)("Authentication failed");
        });
    }
    whoim(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = Auth_1.Auth.verify(req);
            if (account) {
                Auth_1.Auth.publish(res, { account });
                return (0, Common_1.sendData)({ account });
            }
            else {
                Auth_1.Auth.remove(res);
                return (0, Common_1.sendData)(null);
            }
        });
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=AdminController.js.map