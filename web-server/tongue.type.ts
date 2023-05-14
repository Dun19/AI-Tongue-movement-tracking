import IncomingForm from "formidable/Formidable";
import { Request } from "express";

export interface ITongueService {
  postTongueImage(input: string): Promise<object>;
  getResult(input: string): object;
}
