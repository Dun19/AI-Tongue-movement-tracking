import { mockRequest } from "./mock";
import { ITongueService } from "./tongue.type";
import { TongueController } from "./tongue.controller";
import { TongueService } from "./tongue.service";
import { newKnex } from "./knex";
import { Request } from "express";
import { unlink } from "fs";

let ITongueServiceMock: ITongueService;

let tongueControllerMock: TongueController;
let postTongueImageMock: jest.Mock;
let req: Request;

beforeEach(() => {
  postTongueImageMock = jest.fn();
  ITongueServiceMock = { postTongueImage: postTongueImageMock };
  tongueControllerMock = new TongueController(ITongueServiceMock);
  req = mockRequest();
});

describe("PostTongueImage", () => {
  it("", async () => {
    postTongueImageMock.mockResolvedValue({ x: "mock" });

    let json = await tongueControllerMock.postTongueImage(req);
    expect(json).toEqual({ x: "mock" });
    expect(postTongueImageMock).toBeCalled();
  });
});
