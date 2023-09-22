import { pool } from "../../configs/dbConfig.js";

export const dbExecute = (query, params = []) => {
    return new Promise((response) => {
        pool.query(query, params, (error, result, fields) => {
            if (error) {
                const errorContent = {};
                errorContent.dbError = error;
                response(errorContent);
            } else {
                response(result);
            }
        });
    });
};