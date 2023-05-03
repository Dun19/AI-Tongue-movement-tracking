import Knex from "knex";
import { env } from "./env";

let config = require("./knexfile");
let profile = config[env.NODE_ENV];

export let knex = Knex(profile);
