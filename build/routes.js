"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadsRoutes = exports.Routes = void 0;
const AdminController_1 = require("./controller/AdminController");
const BlogController_1 = require("./controller/BlogController");
const ProjectController_1 = require("./controller/ProjectController");
const TagController_1 = require("./controller/TagController");
const UploadsController_1 = require("./controller/UploadsController");
const multer = require("multer");
const path = require("path");
const CategoryController_1 = require("./controller/CategoryController");
const BlogRoute = [
    {
        method: "get",
        route: "/blog",
        controller: BlogController_1.BlogController,
        action: "all"
    },
    {
        method: "post",
        route: "/blog",
        controller: BlogController_1.BlogController,
        action: "save",
        needValid: true
    },
    {
        method: "get",
        route: "/blog/:id",
        controller: BlogController_1.BlogController,
        action: "one"
    },
    {
        method: "put",
        route: "/blog/info/:id",
        controller: BlogController_1.BlogController,
        action: "editInfo",
        needValid: true
    },
    {
        method: "put",
        route: "/blog/:id",
        controller: BlogController_1.BlogController,
        action: "editContent",
        needValid: true
    },
    {
        method: "delete",
        route: "/blog/:id",
        controller: BlogController_1.BlogController,
        action: "remove",
        needValid: true
    }
];
const AdminRoute = [
    {
        method: "post",
        route: "/admin",
        controller: AdminController_1.AdminController,
        action: "login",
    },
    {
        method: "put",
        route: "/admin",
        controller: AdminController_1.AdminController,
        action: "logout",
        needValid: true
    },
    {
        method: "get",
        route: "/admin",
        controller: AdminController_1.AdminController,
        action: "whoim",
    }
];
const ExtRoute = [
    {
        method: "get",
        route: "/project/event",
        controller: ProjectController_1.default,
        action: "all"
    },
    {
        method: "get",
        route: "/project",
        controller: ProjectController_1.default,
        action: "project"
    },
    {
        method: "get",
        route: "/archive",
        controller: ProjectController_1.default,
        action: "archive"
    }
];
const CategoryRoute = [
    {
        method: "get",
        route: "/category/:id",
        controller: CategoryController_1.default,
        action: "one"
    },
    {
        method: "post",
        route: "/category",
        controller: CategoryController_1.default,
        action: "save"
    },
    {
        method: "delete",
        route: "/category/:id",
        controller: CategoryController_1.default,
        action: "remove"
    },
    {
        method: "get",
        route: "/category",
        controller: CategoryController_1.default,
        action: "all"
    }
];
const TagRoute = [
    {
        method: "post",
        route: "/tag",
        controller: TagController_1.TagController,
        action: "add",
        needValid: true
    },
    {
        method: "get",
        route: "/tag",
        controller: TagController_1.TagController,
        action: "all"
    },
    {
        method: "get",
        route: "/tag/:id",
        controller: TagController_1.TagController,
        action: "find"
    },
    {
        method: "delete",
        route: "/tag/:id",
        controller: TagController_1.TagController,
        action: "remove"
    },
    {
        method: "put",
        route: "/tag/:id",
        controller: TagController_1.TagController,
        action: "unLink"
    }
];
exports.Routes = [
    ...BlogRoute,
    ...CategoryRoute,
    ...TagRoute,
    ...AdminRoute,
    ...ExtRoute
];
exports.Routes.map(route => {
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
        }
        else {
            cb(new Error(`不接受扩展名为${extname}的文件`));
        }
    }
});
// const upload = uploadStorage.single("poster");
exports.uploadsRoutes = [
    {
        method: "post",
        route: "/api/uploads",
        controller: UploadsController_1.UploadsController,
        action: "poster",
        fileds: uploadStorage.single("poster"),
    }
];
//# sourceMappingURL=routes.js.map