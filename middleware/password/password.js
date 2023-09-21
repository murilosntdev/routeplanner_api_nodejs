import * as bcrypt from "bcrypt";
import { dbExecute } from '../database/dbExecute.js';

export const accountPassword = async (accountId, password) => {
    var query = `SELECT id, password FROM account WHERE id = $1`;
    var result = await dbExecute(query, [accountId]);

    if (result.dbError) {
        return result;
    }

    var passwordResult = bcrypt.compareSync(password, result.rows[0].password);

    return passwordResult;
}