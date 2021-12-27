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
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const express = require("express");
const bodyParser = require("body-parser");
const routes_1 = require("./routes");
const Common_1 = require("./controller/Common");
const path_to_regexp_1 = require("path-to-regexp");
const Auth_1 = require("./controller/Auth");
const cookieParser = require("cookie-parser");
const path = require("path");
const history = require("connect-history-api-fallback");
const PORT = 3001;
const hanlderRoute = (route) => {
    return (req, res, next) => {
        try {
            const result = (new route.controller)[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => {
                    result !== null && result !== undefined ? res.send(result) : undefined;
                }, err => {
                    res.send((0, Common_1.sendError)(err instanceof Error ? err.message : err));
                });
            }
            else if (result !== null && result !== undefined) {
                res.json(result);
            }
        }
        catch (err) {
            res.send((0, Common_1.sendError)(err instanceof Error ? err.message : err));
        }
    };
};
const hanlderUploadRoute = (route) => {
    return (req, res) => {
        route.fileds(req, res, err => {
            if (err instanceof Error) {
                res.send((0, Common_1.sendError)(err.message));
            }
            else if (err) {
                res.send((0, Common_1.sendError)(err));
            }
            else {
                if (req.files) {
                    res.send((0, Common_1.sendData)(req.files));
                }
                else {
                    res.send((0, Common_1.sendData)("/uploads/" + req.file.filename));
                }
            }
        });
    };
};
(0, typeorm_1.createConnection)().then((connection) => __awaiter(void 0, void 0, void 0, function* () {
    // create express app
    const app = express();
    app.use(bodyParser.json());
    // log
    app.use((req, res, next) => {
        console.log(req.path);
        next();
    });
    // cookie解析
    app.use(cookieParser());
    // 路由资源
    app.use(history());
    // 静态资源
    app.use(express.static(path.resolve(__dirname, "../public")));
    app.use("/", express.static(path.resolve(__dirname, "../public/dist")));
    // 注册鉴权路由
    app.use("/api", (req, res, next) => {
        const matchRoute = routes_1.Routes.find(route => route.method.toUpperCase() === req.method && !!(0, path_to_regexp_1.match)(route.route, { start: true, end: true })(req.path));
        if (matchRoute && matchRoute.needValid) {
            Auth_1.Auth.auth(req, res, next);
        }
        else {
            next();
        }
    });
    // register express routes from defined application routes
    routes_1.Routes.forEach(route => {
        return app[route.method](route.route, hanlderRoute(route));
    });
    // 注册上传路由
    routes_1.uploadsRoutes.forEach(route => {
        app.post(route.route, hanlderUploadRoute(route));
    });
    // setup express app here
    // ...
    // start express server
    app.listen(PORT);
    console.log(`Express server has started on port ${PORT}. Open http://localhost:${PORT}/ to see results`);
})).catch(error => console.log(error));
//# sourceMappingURL=index.js.map