import { dbExecute } from "../services/database/dbExecute.js";

export const selectIdByCnpjEmail = async (cnpj, email) => {
    var query = `SELECT id FROM account WHERE (cnpj = $1) OR (email = $2)`;
    var result = await dbExecute(query, [cnpj, email]);

    if (result.dbError) {
        return (result);
    } else if (result.rows[0]) {
        return 'AlreadyExists';
    }

    return 'NotFound';
}

export const insertAllCompany = async (name, role, cnpj, email, hashPassword, status) => {
    var query = `INSERT INTO account (name, role, cnpj, email, password, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
    var result = await dbExecute(query, [name, role, cnpj, email, hashPassword, status]);

    if (result.dbError) {
        return (result);
    }

    return (result.rows[0]);
}