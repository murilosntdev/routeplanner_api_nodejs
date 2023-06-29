import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config();

export const pool = new pg.Pool({
    user: process.env.POSTGRE_USER,
    host: process.env.POSTGRE_HOST,
    database: process.env.POSTGRE_DATABASE,
    password: process.env.POSTGRE_PASSWORD,
    port: process.env.POSTGRE_PORT
});

export const dbExecute = (query, params=[]) => {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (error, result, fields) => {
            if(error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};