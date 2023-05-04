import { Knex } from "knex";
import { ITongueService } from "./tongue.type";
import IncomingForm from "formidable/Formidable";
import { Request } from "express";
import { METHODS } from "http";

export class TongueService implements ITongueService {
  constructor(private knex: Knex) {}
  async postTongueImage(form: IncomingForm, req: Request): Promise<object> {
    //ToDO
    let json;
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return;
      }
      let formData = new FormData();
      let res = await fetch("http://127.0.0.1:8100/detect", {
        method: "POST",
        body: formData,
      });
      json = await res.json();
      console.log(json);
    });

    return { json };
  }
}
