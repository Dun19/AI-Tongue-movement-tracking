import IncomingForm from "formidable/Formidable";
import { Request } from "express";

export interface ITongueService {
  postTongueImage(form: IncomingForm, req: Request): Promise<object>;
}
