import { config } from "dotenv";
import populateEnv from "populate-env";

config();

export const env = {
  PORT: 8080,
  NODE_ENV: "development",
  DB_HOST: "localhost",
  DB_PORT: 5432,
  DB_NAME: "",
  DB_USERNAME: "",
  DB_PASSWORD: "",
};

populateEnv(env, { mode: "halt" });
