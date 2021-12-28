import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response, NextFunction } from "express";
import { Routes, uploadsRoutes } from "./routes";
import { sendError, sendData } from "./controller/Common";
import { match } from "path-to-regexp";
import { Auth } from "./controller/Auth";
import * as cookieParser from "cookie-parser";
import * as path from "path";
// import * as history from "connect-history-api-fallback";
import * as cors from "cors";

const PORT = 3001;

const hanlderRoute = (route) => {
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

const hanlderUploadRoute = (route) => {
    return (req: Request, res: Response) => {
        route.fileds(req, res, err => {
            if (err instanceof Error) {
                res.send(sendError(err.message));
            } else if (err) {
                res.send(sendError(err));
            } else {
                if (req.files) {
                    res.send(sendData(req.files));
                } else {
                    res.send(sendData("/uploads/" + req.file!.filename));
                }
            }
        });
    }
}

createConnection().then(async connection => {
    // create express app
    const app = express();
    app.use(bodyParser.json());

    // log
    // app.use((req: Request, res: Response, next: NextFunction) => {
    //     console.log(req.path);
    //     next();
    // });

    // cookie解析
    app.use(cookieParser());

    // 路由资源
    // app.use(history());

    app.use(cors({
        origin: (origin, callback) => callback(null, true)
    }));

    // 静态资源
    app.use(express.static(path.resolve(__dirname, "../public")));
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

    // register express routes from defined application routes
    Routes.forEach(route => {
        return (app as any)[route.method](route.route, hanlderRoute(route));
    });

    // 注册上传路由
    uploadsRoutes.forEach(route => {
        app.post(route.route, hanlderUploadRoute(route));
    });

    // setup express app here
    // ...

    // start express server
    app.listen(PORT);

    console.log(`Express server has started on port ${PORT}. Open http://localhost:${PORT}/ to see results`);

}).catch(error => console.log(error));