import { NextFunction, Request, Response } from "express";
import { sendData, sendError } from "../controller/Common";
import { putBuffer } from "../tools/qiniuTool";

export default function (req: Request, res: Response, next: NextFunction) {
  if (req.files) {
    // res.send(sendData(req.files));
    // 上传的是多个文件
    if (Array.isArray(req.files)) {
      Promise.all(req.files.map(file => {
        return new Promise((resolve, reject) => {
          putBuffer(file.filename, file.buffer).then(resolve, reject);
        });
      })).then(urls => {
        res.send(sendData(urls));
      }, err => {
        next(err);
      });
    } else {
      // 其余情况不处理
      next();
    }
  } else {
    putBuffer(req.file.filename, req.file.buffer).then(url => {
      res.send(sendData(url));
    }, err => {
      // res.send(sendError(err));
      next(err);
    })
  }
}