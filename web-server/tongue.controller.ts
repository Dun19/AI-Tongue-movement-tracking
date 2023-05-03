import { HttpController } from "./httpController";
import { ITongueService } from "./tongue.type";
import formidable from "formidable";
import { Request } from "express";

export class TongueController extends HttpController {
  constructor(private tongueService: ITongueService) {
    super();
    this.router.post("/detect", this.wrapMethod(this.postTongueImage));
  }

  postTongueImage = (req: Request) => {
    const uploadDir = "uploads";
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFiles: 1,
      maxFileSize: 1024 ** 2 * 200, // the default limit is 200KB
      filter: (part) => part.mimetype?.startsWith("image/") || false,
    });

    return this.tongueService.postTongueImage(form, req);
  };
}
