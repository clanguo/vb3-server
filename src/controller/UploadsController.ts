import { IRouterHandler, NextFunction, Request, RequestHandler, Response } from "express";
import multer = require("multer");
import { ResponseResult } from "./Common";
import * as path from "path";
import ConfigManager from "../config/configManager";

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
// const whiteExtendName = [];

const uploadStorage = multer({
  storage,
  limits: {
    fileSize: 10485760
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

const memoryStorage = multer.memoryStorage();
export const uploadMemoryStorage = multer({
  storage: memoryStorage,
  fileFilter(req, file, cb) {
    const extname = path.extname(file.originalname);
    if (whiteExtendName.includes(extname)) {
      // 手动添加随机文件名
      const uniqueSuffix = Date.now().toString().substr(5) + '_' + Math.round(Math.random() * 1E9);
      const extname = path.extname(file.originalname);
      file.filename = uniqueSuffix + extname;

      cb(null, true);
    } else {
      cb(new Error(`不接受扩展名为${extname}的文件`));
    }
  }
});

export class UploadsController {
  async poster(req: Request, res: Response, next: NextFunction) {
    ConfigManager.setConfig({
      lastUpdatedTime: Date.now()
    });
    uploadMemoryStorage.single("poster")(req, res, next);
  }
}