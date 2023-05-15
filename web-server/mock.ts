import { Request } from "express";

export function mockRequest(): Request {
  let request: Request = {
    body: { filename: "mock.jpg" },
    params: {},
    query: {},
  } as any;
  return request;
}
