import { config } from "dotenv";
import populateEnv from "populate-env";

config();

export const env = {
  PORT: 8080,
  NODE_ENV: "",
  DB_HOST: "localhost",
  DB_PORT: 5432,
  DB_NAME: "",

  //for development and production
  DB_USERNAME: "",
  DB_PASSWORD: "",

  //for jest
  TEST_DB_NAME: "",
  TEST_DB_USERNAME: "",
  TEST_DB_PASSWORD: "",

  // for CI
  POSTGRES_DB: "",
  POSTGRES_DB_USER: "",
  POSTGRES_DB_PASSWORD: "",
  POSTGRES_DB_HOST: "",
  POSTGRES_DB_PORT: 5432,
};
// if (process.env.NODE_ENV != "test") {
//   env.TEST_DB_NAME = "skip";
//   env.TEST_DB_USERNAME = "skip";
//   env.TEST_DB_PASSWORD = "skip";
// }
// if (process.env.NODE_ENV != "ci") {
//   env.POSTGRES_DB = "skip";
//   env.POSTGRES_DB_USER = "skip";
//   env.POSTGRES_DB_PASSWORD = "skip";
//   env.POSTGRES_DB_HOST = "skip";
// }

// if (process.env.NODE_ENV == "test" || process.env.NODE_ENV == "ci") {
//   env.DB_NAME = "skip";
//   env.DB_USERNAME = "skip";
//   env.DB_PASSWORD = "skip";
// }

populateEnv(env, { mode: "halt" });
2;
