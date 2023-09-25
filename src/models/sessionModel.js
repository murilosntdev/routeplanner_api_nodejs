import { dbExecute } from "../services/database/dbExecute.js";

export const selectIdNameStatusByEmail = async (email) => {
    var query = `SELECT id, name, status FROM account WHERE email = $1`;
    var result = await dbExecute(query, [email]);

    return (result);
}

export const selectIdStatusByEmail = async (email) => {
    var query = `SELECT id, status FROM account WHERE email = $1`;
    var result = await dbExecute(query, [email]);

    return (result);
}

export const selectIdExpirationByAccount_id = async (id) => {
    var query = `SELECT id, expiration FROM token WHERE account_id = $1 AND category = 'LOGIN' AND used = false ORDER BY id DESC LIMIT 1`;
    var result = await dbExecute(query, [id]);

    return (result);
}

export const updateLast_accessByEmail = async (email) => {
    var actualTime = new Date()
    actualTime.setTime(actualTime.getTime());

    var query = `UPDATE account SET last_access = $1 WHERE email = $2 RETURNING last_access`;
    var result = await dbExecute(query, [actualTime, email]);

    return (result);
}