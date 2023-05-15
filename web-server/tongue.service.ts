import { Knex } from "knex";
import { ITongueService } from "./tongue.type";
import { HttpError } from "./error";
import { spawn } from "child_process";
import path from "path";
import { rename } from "fs/promises";

export class TongueService implements ITongueService {
  constructor(private knex: Knex) {}

  async postTongueImage(in_file_path: string, out_file_path: string) {
    let res = await fetch("http://127.0.0.1:8100/detect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ in_file_path, out_file_path }),
    });
    let json = await res.json();
    if (json.error) {
      throw new HttpError(500, json.error);
    }
    let out_extname = path.extname(out_file_path);
    if (out_extname === ".mp4") {
      let tmpfile = out_file_path.replace(".mp4", "-tmp.mp4");
      await new Promise<void>((resolve, reject) => {
        let child = spawn(
          `ffmpeg`,
          ["-i", out_file_path, "-pix_fmt", "yuv420p", tmpfile],
          { stdio: "pipe" }
        );
        child.addListener("close", (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject("Failed to transcode mp4, exit code: " + code);
          }
        });
      });
      await rename(tmpfile, out_file_path);
    }
  }
}
