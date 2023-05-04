import { HttpController } from "./httpController";
import { ITongueService } from "./tongue.type";
import formidable from "formidable";
import { Request } from "express";
import { HttpError } from "./error";

export class TongueController extends HttpController {
  constructor(private tongueService: ITongueService) {
    super();
    this.router.post("/diagnosis", this.wrapMethod(this.postTongueImage));
  }

  postTongueImage = async (req: Request) => {
    const uploadDir = "uploads";
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFiles: 1,
      maxFileSize: 1024 ** 2 * 200, // the default limit is 200KB
      filter: (part) => part.mimetype?.startsWith("image/") || false,
    });

    let { fields, files } = await new Promise<{
      fields: formidable.Fields;
      files: formidable.Files;
    }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    let imageMaybeArray = files.image;
    let image = Array.isArray(imageMaybeArray)
      ? imageMaybeArray[0]
      : imageMaybeArray;
    let filename = image?.newFilename;

    if (!filename) throw new HttpError(400, "missing tongue image");

    return this.tongueService.postTongueImage(filename);
  };
}
