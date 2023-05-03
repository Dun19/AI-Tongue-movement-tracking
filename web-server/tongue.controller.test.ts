import { mockRequest } from "./mock";
import { ITongueService } from "./tongue.type";
import { TongueController } from "./tongue.controller";
import { TongueService } from "./tongue.service";
import { newKnex } from "./knex";
import { Request } from "express";

let tongueServiceMock: TongueService;
let tongueControllerMock: TongueController;

let req: Request;

beforeEach(() => {
  let knex = newKnex();
  tongueServiceMock = new TongueService(knex);
  tongueServiceMock.postTongueImage = jest.fn();
  tongueControllerMock = new TongueController(tongueServiceMock);
  req = mockRequest();
});

describe("PostTongueImage", () => {
  it("", async () => {
    // tongueServiceMock.postTongueImage.mockResolvedValue({ x: "mock" });
    let json = await tongueControllerMock.postTongueImage(req);
    expect(json).toEqual({ x: "mock" });
    expect(tongueServiceMock.postTongueImage).toBeCalled();
  });
});
