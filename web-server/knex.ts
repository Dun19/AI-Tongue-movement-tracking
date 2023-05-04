import Knex from "knex";
import { env } from "./env";

export function newKnex() {
  let config = require("./knexfile");
  let profile = config[env.NODE_ENV];

  let knex = Knex(profile);
  //test1
  return knex;
}
