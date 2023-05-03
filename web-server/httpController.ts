import { NextFunction, Request, Response, Router } from "express";

export class HttpController {
  router = Router();
  wrapMethod(fn: (req: Request) => object | Promise<object>) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        let json = await fn(req);
        res.json(json);
      } catch (error) {
        next(error);
      }
    };
  }
}
