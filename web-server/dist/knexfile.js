"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./env");
// Update with your config settings.
const config = {
    development: {
        client: "pg",
        connection: {
            database: env_1.env.DB_NAME,
            user: env_1.env.DB_USERNAME,
            password: env_1.env.DB_PASSWORD,
            host: env_1.env.DB_HOST,
            port: env_1.env.DB_PORT,
            multipleStatements: true,
        },
    },
    test: {
        client: "pg",
        connection: {
            database: env_1.env.TEST_DB_NAME,
            user: env_1.env.TEST_DB_USERNAME,
            password: env_1.env.TEST_DB_PASSWORD,
            host: env_1.env.DB_HOST,
            port: env_1.env.DB_PORT,
            multipleStatements: true,
        },
    },
    ci: {
        client: "pg",
        connection: {
            database: env_1.env.POSTGRES_DB,
            user: env_1.env.POSTGRES_DB_USER,
            password: env_1.env.POSTGRES_DB_PASSWORD,
            host: env_1.env.POSTGRES_DB_HOST,
            port: env_1.env.POSTGRES_DB_PORT,
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
