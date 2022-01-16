import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { HTTPStatuCode, ServerError } from "../middleware/errorMiddleware";
import { ResponseResult, sendError } from "./Common";

interface IAuthToken {
  account: string | null;

  remember?: 0 | 1
}

export class Auth {
  public static readonly saveLongTime = 3600000 * 24 * 7;

  private static readonly secret = "1234";
  public static readonly tokenKey = "authorization";
  public static async auth(req: Request, res: Response, next: NextFunction): Promise<void> {
    const verifyResult = this.verify(req);
    if (verifyResult) {
      next();
    } else {
      res.send(sendError("身份验证不通过"));
    }
  }

  public static publish(res: Response, info: any = {}, maxAge: number = 3600000 * 24): void {
    const token = jwt.sign(info, this.secret, {
      expiresIn: maxAge
    });

    res.cookie(this.tokenKey, token, {
      maxAge,
    });

    res.header(this.tokenKey, token);
  }

  public static verify(req: Request): null | IAuthToken {
    const cookieToken = req.cookies[this.tokenKey];
    // const headerToken = req.headers[this.tokenKey] as string;
    const remember = req.cookies["remember"] | 0;
    let token: string = cookieToken;
    // if (cookieToken && !headerToken) {
    //   token = cookieToken;
    // } else if (!cookieToken && headerToken) {
    //   token = headerToken;
    // } else if (!cookieToken || cookieToken !== headerToken) {
    //   // 如果cookie和header都没有token   或   不相等
    //   return null;
    // } else {
    //   token = headerToken;
    // }

    if (!token) return null;

    /**
     * 处理bearer格式
     */
    const tokenArray = token.split(" ");
    token = tokenArray.length === 1 ? token : tokenArray[2];

    try {
      const { account, remember }: any = jwt.verify(token, this.secret);
      return account ? { account, remember } : null;
    } catch(e) {
      throw new ServerError(HTTPStatuCode.INTERNAL_SERVER_ERROR);
    }
  }

  public static remove(res: Response): void {
    res.cookie(this.tokenKey, "", {
      maxAge: -1
    });
  }
}