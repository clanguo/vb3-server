import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response, NextFunction, Errback } from "express";
import { IRoute, IUploadRoute, Routes, uploadsRoutes } from "./routes";
import { sendError, sendData } from "./controller/Common";
import { match } from "path-to-regexp";
import { Auth } from "./controller/Auth";
import * as cookieParser from "cookie-parser";
import * as path from "path";
// import * as history from "connect-history-api-fallback";
import ConfigManager from "./config/configManager";
import corsMiddleware from "./middleware/corsMiddleware";
import { routeLogger } from "./logger";
import * as log4js from "log4js";
import errorMiddleware from "./middleware/errorMiddleware";
import uploadMiddleware from "./middleware/uploadMiddleware";
import { OwnerPermission } from "./constant/admin";
import permissionMiddleware from "./middleware/permissionMiddleware";

// 初始创建configManager对象
const configManager = ConfigManager.getConfigManager();

const PORT = 3001;

configManager.setConfig({ startTime: +new Date() });

const hanlderRoute = (route: IRoute) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => {
                    result !== null && result !== undefined ? res.send(result) : undefined
                },
                    err => {
                        res.send(sendError(err instanceof Error ? err.message : err));
                    });
            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        } catch (err) {
            res.send(sendError(err instanceof Error ? err.message : err));
        }
    }

}

const hanlderUploadRoute = (route: IUploadRoute) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        (new route.controller)[route.action](req, res, next);
    }
}

createConnection().then(async connection => {
    // create express app
    const app = express();
    app.use(bodyParser.json());

    // cookie解析
    app.use(cookieParser());

    // 路由资源
    // app.use(history());

    // cors中间件
    app.use(corsMiddleware);

    // logger
    app.use(log4js.connectLogger(routeLogger, {}));

    // 静态资源
    // app.use(express.static(path.resolve(__dirname, "../public")));
    // app.use("/", express.static(path.resolve(__dirname, "../public/dist")));

    // 注册鉴权路由
    app.use("/api", (req: Request, res: Response, next: NextFunction) => {
        const matchRoute = Routes.find(route => route.method.toUpperCase() === req.method && !!match(route.route, { start: true, end: true })(req.path));
        if (matchRoute && matchRoute.needValid) {
            Auth.auth(req, res, next);
        } else {
            next();
        }
    });

    /**
     * 操作权限处理中间件
     */
    Routes.forEach(route => {
        if (route.permissiion && route.permissiion === OwnerPermission) {
            return (app as any)[route.method](route.route, permissionMiddleware);
        }
    });

    // register express routes from defined application routes
    Routes.forEach(route => {
        return (app as any)[route.method](route.route, hanlderRoute(route));
    });

    // 注册上传路由
    uploadsRoutes.forEach(route => {
        app.post(route.route, hanlderUploadRoute(route), uploadMiddleware);
    });

    // setup express app here
    // ...

    app.use(errorMiddleware);

    // start express server
    app.listen(PORT);

    console.log(`Express server has started on port ${PORT}. Open http://localhost:${PORT}/ to see results`);

}).catch(error => console.log(error));