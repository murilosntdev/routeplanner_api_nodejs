import { dbExecute } from "../services/database/dbExecute.js";

export const selectIdNameStatusByEmail = async (email) => {
    var query = `SELECT id, name, email, status FROM account WHERE email = $1`;
    var result = await dbExecute(query, [email]);

    if (result.dbError || result.rows[0]) {
        return (result);
    }

    return 'notFound';
}

export const selectIdExpirationByAccount_id = async (id) => {
    var query = `SELECT id, expiration FROM token WHERE account_id = $1 AND category = 'VALIDATE_ACCOUNT' AND used = false ORDER BY id DESC LIMIT 1`;
    var result = await dbExecute(query, [id]);

    return (result);
}

export const updateStatusById = async (id) => {
    var query = `UPDATE account SET status = 'CONTA_ATIVA' WHERE id = $1 RETURNING status`;
    var result = await dbExecute(query, [id]);

    return (result);
}