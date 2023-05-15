import { Knex } from "knex";
import { ITongueService } from "./tongue.type";
import IncomingForm from "formidable/Formidable";
import { Request } from "express";
import { METHODS } from "http";
import path from "path";
import { json } from "stream/consumers";
import fs from "fs";

export class TongueService implements ITongueService {
  constructor(private knex: Knex) {}
  async postTongueImage(filename: string): Promise<object> {
    let res = await fetch("http://127.0.0.1:8100/detect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: filename }),
    });
    let json = await res.json();

    let data = await new Promise<Buffer>((resolve, reject) => {
      fs.readFile(json.result_path, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
    fs.unlink(json.result_path, (err) => {
      if (err) {
        console.log("failed to delete empty file:", err);
      }
    });

    return { data, mimetype: json.mimetype };
  }
}
