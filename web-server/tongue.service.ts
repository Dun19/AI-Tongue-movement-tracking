import { Knex } from "knex";
import { ITongueService } from "./tongue.type";
import IncomingForm from "formidable/Formidable";
import { Request } from "express";
import { METHODS } from "http";
import path from "path";

export class TongueService implements ITongueService {
  constructor(private knex: Knex) {}
  async postTongueImage(filename: string): Promise<object> {
    let res = await fetch("http://127.0.0.1:8100/detect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: filename }),
    });
    let json = await res.json();

    return json;
  }
}
