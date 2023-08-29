import * as crypto from 'crypto';
import { dbExecute } from '../../src/configDB.js';

export const createToken = async (account_id, category, expirationInMinutes, hashSize) => {
    const hash = crypto.randomBytes(hashSize).toString('base64').slice(0, hashSize);
    var expiration = new Date();

    expiration.setTime(expiration.getTime() + expirationInMinutes * 60 * 1000);

    var query = `INSERT INTO token (account_id, category, hash, expiration) VALUES ($1, $2, $3, $4)`;
    var result = await dbExecute(query, [account_id, category, hash, expiration]);

    if(result.dbError) {
        return result;
    }  

    var query = `SELECT id FROM token WHERE account_id = $1`;
    var result = await dbExecute(query, [account_id]);

    if(result.dbError) {
        return result;
    }

    return 'criated';
}