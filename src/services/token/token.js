import { dbExecute } from '../database/dbExecute.js';
import jsonwebtoken from "jsonwebtoken";
import * as crypto from 'crypto';

const { sign } = jsonwebtoken;

export const createToken = async (account_id, category, hashSize, expirationInMinutes) => {
    const hash = crypto.randomBytes(hashSize).toString('base64').slice(0, hashSize);

    var expiration = new Date();
    expiration.setTime(expiration.getTime() + expirationInMinutes * 60 * 1000);

    var query = `INSERT INTO token (account_id, category, hash, expiration) VALUES ($1, $2, $3, $4) RETURNING hash`;
    var result = await dbExecute(query, [account_id, category, hash, expiration]);

    return (result);
}

export const confirmToken = async (account_id, category, token) => {
    var query = `SELECT id, hash FROM token WHERE account_id = $1 AND category = $2 AND used = false ORDER BY id DESC LIMIT 1`;
    var tokenResult = await dbExecute(query, [account_id, category]);

    if (tokenResult.dbError) {
        return (tokenResult);
    }

    if (tokenResult.rows[0].hash === token) {
        var query = `UPDATE token SET used = true WHERE id = $1 RETURNING used`;
        var result = await dbExecute(query, [tokenResult.rows[0].id]);

        if (result.dbError) {
            return (result);
        }

        return (result.rows[0].used);
    }

    return (false);
}

export const createRefreshToken = async (account_id) => {
    const jwtToken = sign({
        account_id: account_id
    },
        process.env.JWT_REFRESH_KEY,
        {
            expiresIn: "8h"
        });

    var expiration = new Date();
    expiration.setTime(expiration.getTime() + 8 * 60 * 60 * 1000);

    var query = `INSERT INTO refresh_token (account_id, token, expiration) VALUES ($1, $2, $3) RETURNING token`;
    var result = await dbExecute(query, [account_id, jwtToken, expiration]);

    return (result);
}

export const revokeRefreshToken = async (account_id) => {
    var query = `UPDATE refresh_token SET revoked = true WHERE account_id = $1 and revoked = false`;
    var result = await dbExecute(query, [account_id]);

    return (result);
}