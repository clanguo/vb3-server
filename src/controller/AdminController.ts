import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Admin } from "../entity/Admin";
import { Auth } from "./Auth";
import { ResponseResult, sendData, sendError } from "./Common";

// interface IResponseAdmin extends Required<Exclude<Admin, "password">> { };

export class AdminController {
  private useAdmin = getRepository(Admin);

  async login(req: Request, res: Response, next: NextFunction): Promise<ResponseResult<string>> {
    const admin = Admin.transform(req.body);

    const errors = await admin.validateThis();
    if (errors.length) {
      return sendError(errors.join("; "));
    }

    // 检查jwt
    const token = Auth.verify(req);
    if (token) {
      if ((token as Admin).account === admin.account) {
        Auth.publish(res, { account: admin.account });
        return sendError("已登录");
      }

      return sendError("请先退出登录");
    }

    const adminIns = await this.useAdmin.findOne(admin.account);
    if (adminIns && adminIns.password === admin.password) {
      const data = { account: adminIns.account };
      Auth.publish(res, data);
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
      return sendError("Authentication failed");
    }

    const adminIns = await this.useAdmin.findOne(admin.account);
    if (adminIns) {
      Auth.remove(res);
      return sendData("成功退出登录");
    }

    return sendError("Authentication failed");
  }

  async whoim(req: Request, res: Response, next: NextFunction): Promise<ResponseResult<any>> {
    const account = Auth.verify(req);
    if (account) {
      Auth.publish(res, { account });
      return sendData({ account });
    } else {
      Auth.remove(res);
      return sendData(null);
    }
  }
}