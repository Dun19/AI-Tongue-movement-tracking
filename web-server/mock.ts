import { Request } from "express";

export function mockRequest(): Request {
  let request: Request = { body: {}, params: {}, query: {} } as any;
  return request;
}
