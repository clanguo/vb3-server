import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { ResponseResult, sendError } from "./Common";

export class Auth {
  private static readonly secret = "1234";
  public static readonly tokenKey = "authorization";
  public static async auth(req: Request, res: Response, next: NextFunction): Promise<void> {
    const verifyResult = this.verify(req);
    if (verifyResult) {
      next();
    } else {
      res.send(sendError("Authentication failed"));
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

  public static verify(req: Request): null | jwt.JwtPayload | string {
    const cookieToken = req.cookies[this.tokenKey];
    const headerToken = req.headers[this.tokenKey] as string;
    let token: string;
    console.log(cookieToken, headerToken)
    if (cookieToken && !headerToken) {
      token = cookieToken;
    } else if (!cookieToken && headerToken) {
      token = headerToken;
    } else if (!cookieToken || cookieToken !== headerToken) {
      // 如果cookie和header都没有token   或   不相等
      return null;
    } else {
      token = headerToken;
    }

    /**
     * 处理bearer格式
     */
    const tokenArray = token.split(" ");
    token = tokenArray.length === 1 ? token : tokenArray[2];

    try {
      const decodeToken: any = jwt.verify(token, this.secret);
      return decodeToken.account;
    } catch {
      return null;
    }
  }

  public static remove(res: Response): void {
    res.cookie(this.tokenKey, "", {
      maxAge: -1
    });
  }
}