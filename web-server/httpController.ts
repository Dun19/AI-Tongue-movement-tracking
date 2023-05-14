import { NextFunction, Request, Response, Router } from "express";
import path from "path";
export class HttpController {
  router = Router();
  wrapMethod(fn: (req: Request) => object | Promise<object>) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        let json = await fn(req);
        console.log(json);
        res.json(json);
      } catch (error) {
        next(error);
      }
    };
  }
}
