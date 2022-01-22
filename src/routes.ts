import { ClassConstructor } from "class-transformer"
import { AdminController } from "./controller/AdminController";
import { BlogController } from "./controller/BlogController";
import ProjectController from "./controller/ProjectController";
import { TagController } from "./controller/TagController";
import { uploadMemoryStorage, UploadsController } from "./controller/UploadsController";
import * as multer from 'multer';
import * as path from "path";
import CategoryController from "./controller/CategoryController";
import { AdminPermission, OwnerPermission } from "./constant/admin";

export interface IRoute {
    method: "get" | "post" | "put" | "delete";
    route: string;
    controller: ClassConstructor<any>;
    action: string;
    needValid?: boolean;
    permissiion?: AdminPermission;
}

export interface IUploadRoute extends IRoute {
    fileds: any,
    method: "post"
}

const BlogRoute: IRoute[] = [
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
        needValid: true,
        permissiion: OwnerPermission
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
        needValid: true,
        permissiion: OwnerPermission
    },
    {
        method: "put",
        route: "/blog/:id",
        controller: BlogController,
        action: "editContent",
        needValid: true,
        permissiion: OwnerPermission
    },
    {
        method: "delete",
        route: "/blog/:id",
        controller: BlogController,
        action: "remove",
        needValid: true,
        permissiion: OwnerPermission
    }
];

const AdminRoute: IRoute[] = [
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
    }
];

const ProjectRoute: IRoute[] = [
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
    },
    {
        method: "get",
        route: "/project/setting",
        controller: ProjectController,
        action: "getSetting",
        needValid: true
    },
    {
        method: "post",
        route: "/project/setting",
        controller: ProjectController,
        action: "setSetting",
        needValid: true,
        permissiion: OwnerPermission
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
        needValid: true,
        action: "save",
        permissiion: OwnerPermission
    },
    {
        method: "delete",
        route: "/category/:id",
        controller: CategoryController,
        needValid: true,
        action: "remove",
        permissiion: OwnerPermission
    },
    {
        method: "get",
        route: "/category",
        controller: CategoryController,
        action: "all"
    }
];

const TagRoute: IRoute[] = [
    {
        method: "post",
        route: "/tag",
        controller: TagController,
        action: "add",
        needValid: true,
        permissiion: OwnerPermission
    },
    {
        method: "get",
        route: "/tag",
        controller: TagController,
        action: "all",
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
        needValid: true,
        action: "remove",
        permissiion: OwnerPermission
    },
    {
        method: "put",
        route: "/tag/:id",
        controller: TagController,
        action: "unLink",
        permissiion: OwnerPermission
    }
];

export const Routes = [
    ...BlogRoute,
    ...CategoryRoute,
    ...TagRoute,
    ...AdminRoute,
    ...ProjectRoute
];

Routes.map(route => {
    route.route = `/api${route.route}`;
    return route;
});


export const uploadsRoutes: IUploadRoute[] = [
    {
        method: "post",
        route: "/api/uploads",
        controller: UploadsController,
        action: "poster",
        needValid: true,
        permissiion: OwnerPermission,
        // fileds: uploadStorage.single("poster"),
        fileds: uploadMemoryStorage.single("poster"),
    }
];