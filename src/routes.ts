import { ClassConstructor } from "class-transformer"
import { AdminController } from "./controller/AdminController";
import { BlogController } from "./controller/BlogController";
import ProjectController from "./controller/ProjectController";
import { TagController } from "./controller/TagController";
import { UploadsController } from "./controller/UploadsController";
import * as multer from 'multer';
import * as path from "path";
import CategoryController from "./controller/CategoryController";

interface IRoute {
    method: "get" | "post" | "put" | "delete";
    route: string;
    controller: ClassConstructor<any>;
    action: string;
    needValid?: boolean;
}

const _Routes: IRoute[] = [
    {
        method: "get",
        route: "/blog",
        controller: BlogController,
        action: "all"
    },
    {
        method: "post",
        route: "/blog",
        controller: BlogController,
        action: "save",
        needValid: true
    },
    {
        method: "get",
        route: "/blog/:id",
        controller: BlogController,
        action: "one"
    },
    {
        method: "put",
        route: "/blog/info/:id",
        controller: BlogController,
        action: "editInfo",
        needValid: true
    },
    {
        method: "put",
        route: "/blog/:id",
        controller: BlogController,
        action: "editContent",
        needValid: true
    },
    {
        method: "post",
        route: "/tag",
        controller: TagController,
        action: "add",
        needValid: true
    },
    {
        method: "get",
        route: "/tag",
        controller: TagController,
        action: "all"
    },
    {
        method: "get",
        route: "/tag/:id",
        controller: TagController,
        action: "find"
    },
    {
        method: "delete",
        route: "/tag/:id",
        controller: TagController,
        action: "remove"
    },
    {
        method: "delete",
        route: "/blog/:id",
        controller: BlogController,
        action: "remove",
        needValid: true
    },
    {
        method: "post",
        route: "/admin",
        controller: AdminController,
        action: "login",
    },
    {
        method: "put",
        route: "/admin",
        controller: AdminController,
        action: "logout",
        needValid: true
    },
    {
        method: "get",
        route: "/admin",
        controller: AdminController,
        action: "whoim",
    },
    {
        method: "get",
        route: "/project/event",
        controller: ProjectController,
        action: "all"
    },
    {
        method: "get",
        route: "/project",
        controller: ProjectController,
        action: "project"
    },
    {
        method: "get",
        route: "/archive",
        controller: ProjectController,
        action: "archive"
    }
];

const CategoryRoute: IRoute[] = [
    {
        method: "get",
        route: "/category/:id",
        controller: CategoryController,
        action: "one"
    },
    {
        method: "post",
        route: "/category",
        controller: CategoryController,
        action: "save"
    },
    {
        method: "delete",
        route: "/category/:id",
        controller: CategoryController,
        action: "remove"
    },
    {
        method: "get",
        route: "/category",
        controller: CategoryController,
        action: "all"
    }
];

export const Routes = [
    ..._Routes,
    ...CategoryRoute
];

Routes.map(route => {
    route.route = `/api${route.route}`;
    return route;
});

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.resolve(__dirname, "../public/uploads"));
    },
    filename(req, file, cb) {
        const uniqueSuffix = Date.now().toString().substr(5) + '_' + Math.round(Math.random() * 1E9);
        const extname = path.extname(file.originalname);
        cb(null, uniqueSuffix + extname);
    }
});


const whiteExtendName = [".png", '.jpg', '.jpeg', '.gif'];

const uploadStorage = multer({
    storage,
    limits: {
        fileSize: 10485760
        // fileSize: 1
    },
    fileFilter(req, file, cb) {
        const extname = path.extname(file.originalname);
        if (whiteExtendName.includes(extname)) {
            cb(null, true);
        } else {
            cb(new Error(`不接受扩展名为${extname}的文件`));
        }
    }
});
// const upload = uploadStorage.single("poster");

export const uploadsRoutes = [
    {
        method: "post",
        route: "/api/uploads",
        controller: UploadsController,
        action: "poster",
        fileds: uploadStorage.single("poster"),
    }
];