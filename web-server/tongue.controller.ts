import { HttpController } from "./httpController";
import { ITongueService } from "./tongue.type";
import formidable from "formidable";
import express, { Request, Response, NextFunction } from "express";
import { HttpError } from "./error";
import path, { join } from "path";
import { mkdirSync, unlink } from "fs";
import { randomUUID } from "crypto";

const uploadDir = "uploads";
const resultDir = "result";

mkdirSync(uploadDir, { recursive: true });
mkdirSync(resultDir, { recursive: true });

async function formParse(req: Request, res: Response, next: NextFunction) {
  try {
    const form = formidable({
      uploadDir,
      maxFiles: 1,
      maxFileSize: 1024 ** 2 * 500, // the default limit is 200KB
      filter: (part) =>
        part.mimetype?.startsWith("image/") ||
        part.mimetype?.startsWith("video/") ||
        false,
      filename(name, ext, part, form) {
        return randomUUID() + "." + part.mimetype?.split("/").pop();
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

    if (!file) throw new HttpError(400, "missing tongue image or video");

    req.body.file = file;
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
    this.router.use("/result", express.static(resultDir));
  }

  postTongueImage = async (req: Request) => {
    let file = req.body.file as formidable.File;

    let in_file_path = path.resolve(uploadDir, file.newFilename);
    let out_filename = file.newFilename;
    if (file.mimetype?.split("/")[0] == "video") {
      out_filename = (file.newFilename + ".mp4").replace(".mp4.mp4", ".mp4");
    }

    let out_file_path = path.resolve(resultDir, out_filename);

    await this.tongueService.postTongueImage(in_file_path, out_file_path);
    return { filename: out_filename };
  };
}
