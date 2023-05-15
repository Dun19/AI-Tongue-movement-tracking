import { HttpController } from "./httpController";
import { ITongueService } from "./tongue.type";
import formidable from "formidable";
import { Request, Response, NextFunction } from "express";
import { HttpError } from "./error";
import { join } from "path";
import { unlink } from "fs";

async function formParse(req: Request, res: Response, next: NextFunction) {
  try {
    const uploadDir = "uploads";
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFiles: 1,
      maxFileSize: 1024 ** 2 * 500, // the default limit is 200KB
      filter: (part) => {
        if (
          part.mimetype?.startsWith("image/") ||
          part.mimetype?.startsWith("video/")
        ) {
          return true;
        } else return false;
      },
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

    let MaybeArray = files.file;
    let file = Array.isArray(MaybeArray) ? MaybeArray[0] : MaybeArray;
    let filename = file?.newFilename;

    if (!filename) throw new HttpError(400, "missing tongue image");

    req.body.filename = filename;
    next();
  } catch (error) {
    next(error);
  }
}

export class TongueController extends HttpController {
  constructor(private tongueService: ITongueService) {
    super();
    this.router.post(
      "/diagnosis",
      formParse,
      this.wrapMethod(this.postTongueImage)
    );
  }

  postTongueImage = async (req: Request) => {
    let result = await this.tongueService.postTongueImage(req.body.filename);
    let file = join("uploads", req.body.filename);
    unlink(file, (err) => {
      if (err) {
        // console.log("failed to delete empty file:", err);
      }
    });
    return result;
  };
}
