import { Knex } from "knex";
import { ITongueService } from "./tongue.type";

export class TongueService implements ITongueService {
  constructor(private knex: Knex) {}
  async postTongueImage(): Promise<object> {
    //ToDO
    return {};
  }
}
