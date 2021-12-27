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
exports.Auth = void 0;
const jwt = require("jsonwebtoken");
const Common_1 = require("./Common");
class Auth {
    static auth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const verifyResult = this.verify(req);
            if (verifyResult) {
                next();
            }
            else {
                res.send((0, Common_1.sendError)("Authentication failed"));
            }
        });
    }
    static publish(res, info = {}, maxAge = 3600000 * 24) {
        const token = jwt.sign(info, this.secret, {
            expiresIn: maxAge
        });
        res.cookie(this.tokenKey, token, {
            maxAge,
        });
        res.header(this.tokenKey, token);
    }
    static verify(req) {
        const cookieToken = req.cookies[this.tokenKey];
        const headerToken = req.headers[this.tokenKey];
        let token;
        console.log(cookieToken, headerToken);
        if (cookieToken && !headerToken) {
            token = cookieToken;
        }
        else if (!cookieToken && headerToken) {
            token = headerToken;
        }
        else if (!cookieToken || cookieToken !== headerToken) {
            // 如果cookie和header都没有token   或   不相等
            return null;
        }
        else {
            token = headerToken;
        }
        /**
         * 处理bearer格式
         */
        const tokenArray = token.split(" ");
        token = tokenArray.length === 1 ? token : tokenArray[2];
        try {
            const decodeToken = jwt.verify(token, this.secret);
            return decodeToken.account;
        }
        catch (_a) {
            return null;
        }
    }
    static remove(res) {
        res.cookie(this.tokenKey, "", {
            maxAge: -1
        });
    }
}
exports.Auth = Auth;
Auth.secret = "1234";
Auth.tokenKey = "authorization";
//# sourceMappingURL=Auth.js.map