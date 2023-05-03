import { Knex } from "knex";
import { ITongueService } from "./tongue.type";
import IncomingForm from "formidable/Formidable";
import { Request } from "express";

export class TongueService implements ITongueService {
  constructor(private knex: Knex) {}
  async postTongueImage(form: IncomingForm, req: Request): Promise<object> {
    //ToDO
    form.parse(req, (err, fields, files) => {
      if (err) {
        return;
      }
    });
    return {};
  }
}
