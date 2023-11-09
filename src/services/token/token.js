import { dbExecute } from '../database/dbExecute.js';
import jsonwebtoken from "jsonwebtoken";
import * as crypto from 'crypto';

const { sign, verify, decode } = jsonwebtoken;

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
        }
    );

    var expiration = new Date();
    expiration.setTime(expiration.getTime() + 8 * 60 * 60 * 1000);

    var query = `INSERT INTO refresh_token (account_id, token, expiration) VALUES ($1, $2, $3) RETURNING token`;
    var result = await dbExecute(query, [account_id, jwtToken, expiration]);

    return (result);
}

export const confirmRefreshToken = async (token) => {
    var query = `SELECT id, token FROM refresh_token WHERE token = $1 AND revoked = false`;
    var tokenResult = await dbExecute(query, [token]);

    if (tokenResult.dbError) {
        return (tokenResult);
    }

    if (!tokenResult.rows[0]) {
        return 'notFound';
    }

    const validateToken = verify(tokenResult.rows[0].token, process.env.JWT_REFRESH_KEY);
    const actualTimestamp = Math.floor(Date.now() / 1000);

    if (actualTimestamp > validateToken.exp) {
        return 'overdue';
    }

    var query = `SELECT email FROM account WHERE id = $1`;
    var account_result = await dbExecute(query, [validateToken.account_id]);

    var result = revokeRefreshToken(validateToken.account_id);

    if (result.dbError) {
        return (result);
    }

    return ({
        "account_id": validateToken.account_id,
        "email": account_result.rows[0].email
    });
}

export const revokeRefreshToken = async (account_id) => {
    var query = `UPDATE refresh_token SET revoked = true WHERE account_id = $1 and revoked = false`;
    var result = await dbExecute(query, [account_id]);

    return (result);
}

export const confirmBearerToken = (bearerToken) => {
    var token = bearerToken.substring(7);

    try {
        verify(token, process.env.JWT_KEY);
    } catch (error) {
        return 'invalid';
    }

    const decodedToken = decode(token);

    return decodedToken;
}