import { mockRequest } from "./mock";
import { ITongueService } from "./tongue.type";
import { TongueController } from "./tongue.controller";
import { Request } from "express";

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
    let json = await tongueControllerMock.postTongueImage(req);
    expect(postTongueImageMock).toBeCalled();
  });
});
