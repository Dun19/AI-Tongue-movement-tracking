import { Request } from "express";

export function mockRequest(): Request {
  let request: Request = {
    body: { file: { newFilename: "123.jpeg" } },
    params: {},
    query: {},
  } as any;
  return request;
}
