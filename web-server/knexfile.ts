import type { Knex } from "knex";
import { env } from "./env";
// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      database: env.DB_NAME,
      user: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      host: env.DB_HOST,
      port: env.DB_PORT,
      multipleStatements: true,
    },
  },
  test: {
    client: "pg",
    connection: {
      database: env.TEST_DB_NAME,
      user: env.TEST_DB_USERNAME,
      password: env.TEST_DB_PASSWORD,
      host: env.DB_HOST,
      port: env.DB_PORT,
      multipleStatements: true,
    },
  },
  ci: {
    client: "pg",
    connection: {
      database: env.POSTGRES_DB,
      user: env.POSTGRES_DB_USER,
      password: env.POSTGRES_DB_PASSWORD,
      host: env.POSTGRES_DB_HOST,
      port: env.POSTGRES_DB_PORT,
      multipleStatements: true,
      debug: true,
    },
  },
  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

module.exports = config;
