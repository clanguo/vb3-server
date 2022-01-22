import { NextFunction, Request, Response } from "express";
import { getConnection, getRepository } from "typeorm";
import { AdminPermission, hasPermission, OwnerPermission } from "../constant/admin";
import { Auth } from "../controller/Auth";
import { sendData, sendError } from "../controller/Common";
import { Admin } from "../entity/Admin";

// const useAdmin = getRepository(Admin);

export default async (req: Request, res: Response, next: NextFunction) => {
  const useAdmin = getConnection().getRepository(Admin);

  const result = Auth.verify(req);
  if (result) {
    const account = await useAdmin.findOne(result.account);
    if (account && hasPermission(account.permission, AdminPermission.WRITE)) {
      next();
    } else {
      res.send(sendError("无操作权限，请联系网站管理员升级权限"));
    }
  }
}