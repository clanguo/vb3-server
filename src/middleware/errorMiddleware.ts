import { NextFunction, Request, Response } from "express";
import { sendError } from "../controller/Common";

/**
 * 保留
 * 也许会用
 */


export enum HTTPStatuCode {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORIBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  INTERNAL_SERVER_ERROR = 500,
}


type IClientErrorStatuCode = HTTPStatuCode.BAD_REQUEST | HTTPStatuCode.UNAUTHORIZED | HTTPStatuCode.FORIBIDDEN | HTTPStatuCode.METHOD_NOT_ALLOWED | HTTPStatuCode.NOT_FOUND;
type IServerErrorStatuCode = HTTPStatuCode.METHOD_NOT_ALLOWED | HTTPStatuCode.INTERNAL_SERVER_ERROR;
export class Exception extends Error {
  private _statuCode = HTTPStatuCode.SUCCESS;

  constructor(msg: string = "") {
    super(msg);
  }

  public get statuCode() {
    return this._statuCode;
  }
}

/**
 * 客户端请求错误
 */
export class ClientError extends Error {
  private _statuCode: IClientErrorStatuCode;

  constructor(statuCode: IClientErrorStatuCode);
  constructor(statuCode: IClientErrorStatuCode, msg: string);
  constructor(statuCode: IClientErrorStatuCode, msg: string = "") {
    super(msg);
    this._statuCode = statuCode;
  }

  public get statuCode() {
    return this._statuCode;
  }
}

/**
 * 服务器发生错误
 */
export class ServerError extends Error {
  private _statuCode: IServerErrorStatuCode;

  constructor(statuCode: IServerErrorStatuCode);
  constructor(statuCode: IServerErrorStatuCode, msg: string);
  constructor(statuCode: IServerErrorStatuCode, msg: string = "") {
    super(msg);
    this._statuCode = statuCode;
  }

  public get statuCode() {
    return this._statuCode;
  }
}

/**
 * 跨域异常
 */
export class CORSError extends Exception {

}

export default (err: Error, req: Request, res: Response, next: NextFunction) => {
  // 只是异常，那么响应异常信息即可
  if (err instanceof Exception) {
    res.send(sendError(err.message));
  } 
  // 客户端或者服务器端错误
  else if (err instanceof ClientError || err instanceof ServerError) {
    res.status(err.statuCode).send(err.message);
  }
  // 未知错误，当作服务器不理解请求（400）
  else {
    res.status(HTTPStatuCode.BAD_REQUEST);
  }
};