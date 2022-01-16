import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Admin } from "../entity/Admin";
import { Exception } from "../middleware/errorMiddleware";
import { Auth } from "./Auth";
import { ResponseResult, sendData, sendError } from "./Common";

// interface IResponseAdmin extends Required<Exclude<Admin, "password">> { };

export class AdminController {
  private useAdmin = getRepository(Admin);

  async login(req: Request, res: Response, next: NextFunction): Promise<ResponseResult<string>> {
    const admin = Admin.transform(req.body);

    const errors = await admin.validateThis();
    if (errors.length) {
      // return sendError(errors.join("; "));
      return sendError("账号或密码错误");
    }

    // 检查jwt
    const token = Auth.verify(req);
    if (token) {
      const { account, remember = 0 } = token;
      
      if (account === admin.account) {
        if (remember === 1) {
          Auth.publish(res, { account: admin.account }, Auth.saveLongTime);
        } else {
          Auth.publish(res, { account: admin.account });
        }
        return sendError("已登录");
      }

      return sendError("请先退出登录");
    }

    const adminIns = await this.useAdmin.findOne(admin.account);
    if (adminIns && adminIns.password === admin.password) {
      const remember = req.body.remember | 0;
      const data = { account: adminIns.account, remember };
      if (remember === 1) {
        Auth.publish(res, data, Auth.saveLongTime);
      } else {
        Auth.publish(res, data);
      }
      return sendData(data);
    } else {
      return sendError("账号或密码错误");
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<ResponseResult<string>> {
    const verifyResult: any = Auth.verify(req);

    const admin = Admin.transform({ name: verifyResult });
    const errors = await admin.validateThis(true);
    if (errors.length) {
      return sendError(errors.join("; "));
    }

    // token验证失败
    if (!verifyResult) {
      return sendError("身份验证不通过");
    }

    const adminIns = await this.useAdmin.findOne(admin.account);
    if (adminIns) {
      Auth.remove(res);
      return sendData("成功退出登录");
    }

    return sendError("身份验证不通过");
  }

  async whoim(req: Request, res: Response, next: NextFunction): Promise<ResponseResult<any>> {
    const result: any = Auth.verify(req);

    if (result) {
      const { account, remember = 0 } = result;
      if (remember === 1) {
        Auth.publish(res, { account }, 3600000 * 24 * 7);
      } else {
        Auth.publish(res, { account });
      }
      return sendData({ account });
    } else {
      Auth.remove(res);
      return sendData(null);
    }
  }
}