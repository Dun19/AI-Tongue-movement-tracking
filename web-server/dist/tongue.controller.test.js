"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mock_1 = require("./mock");
const tongue_controller_1 = require("./tongue.controller");
let ITongueServiceMock;
let tongueControllerMock;
let postTongueImageMock;
let req;
beforeEach(() => {
    postTongueImageMock = jest.fn();
    ITongueServiceMock = { postTongueImage: postTongueImageMock };
    tongueControllerMock = new tongue_controller_1.TongueController(ITongueServiceMock);
    req = (0, mock_1.mockRequest)();
});
describe("PostTongueImage", () => {
    it("", async () => {
        postTongueImageMock.mockResolvedValue({ x: "mock" });
        let json = await tongueControllerMock.postTongueImage(req);
        expect(json).toEqual({ x: "mock" });
        expect(postTongueImageMock).toBeCalled();
    });
});
