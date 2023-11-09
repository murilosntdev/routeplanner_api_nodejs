import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config();

export const pool = new pg.Pool({
    user: process.env.POSTGRE_USER,
    host: process.env.POSTGRE_HOST,
    database: process.env.POSTGRE_DATABASE,
    password: process.env.POSTGRE_PASSWORD,
    port: process.env.POSTGRE_PORT,
    ssl: {
        rejectUnauthorized: false
    }
});