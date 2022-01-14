import { NextFunction, Request, Response } from "express";
import { sendError } from "../controller/Common";

export class CORSError extends Error {

}

export default (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CORSError) {
    res.status(200).send(sendError(err.message));
  } else {
    res.sendStatus(500);
  }
};