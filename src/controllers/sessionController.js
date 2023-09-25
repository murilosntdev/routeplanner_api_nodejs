import { selectIdNameStatusByEmail, selectIdStatusByEmail, selectIdExpirationByAccount_id, updateLast_accessByEmail } from "../models/sessionModel.js";
import { sendMail, hideEmail } from "../services/email/email.js";
import { accountPassword } from "../services/password/password.js";
import { errorResponse } from "../services/responses/error.js";
import { successResponse } from "../services/responses/success.js";
import { validatePreLoginInput, validateLoginInput } from "../services/sessionServices.js";
import { createToken, confirmToken, createRefreshToken, revokeRefreshToken } from "../services/token/token.js";
import jsonwebtoken from "jsonwebtoken";

const { sign } = jsonwebtoken;

export const preLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const validateInput = validatePreLoginInput(email, password);

    if (validateInput !== 'noErrors') {
        res.status(422);
        res.json(errorResponse(422, validateInput));
        return;
    }

    const checkAccount = await selectIdNameStatusByEmail(email);

    if (checkAccount.dbError) {
        res.status(503);
        res.json(errorResponse(503, null, checkAccount));
        return;
    } else if (!checkAccount.rows[0] || ((checkAccount.rows[0].status !== 'CONTA_ATIVA') && (checkAccount.rows[0].status !== 'CONTA_CRIADA'))) {
        res.status(404);
        res.json(errorResponse(404, "Nao e possivel localizar uma conta com o 'email' informado"));
        return;
    } else if (checkAccount.rows[0].status === 'CONTA_CRIADA') {
        res.status(400);
        res.json(errorResponse(400, "A conta informada nao esta ativa"));
        return;
    }

    var passwordResult = await accountPassword(checkAccount.rows[0].id, password);

    if (!passwordResult) {
        res.status(403);
        res.json(errorResponse(403, "Senha incorreta"));
    }

    const checkToken = await selectIdExpirationByAccount_id(checkAccount.rows[0].id);

    if (checkToken.dbError) {
        res.status(503);
        res.json(errorResponse(503, null, checkToken));
        return;
    }

    var actualTime = new Date()
    actualTime.setTime(actualTime.getTime());

    if (checkToken.rows[0] && checkToken.rows[0].expiration > actualTime) {
        res.status(400);
        res.json(errorResponse(400, "Ainda existe um token ativo para a conta informada"));
        return;
    }

    var tokenResult = await createToken(checkAccount.rows[0].id, 'LOGIN', 4, 2);

    if (tokenResult.dbError) {
        res.status(503);
        res.json(errorResponse(503, null, tokenResult));
        return;
    }

    var templateContext = {
        name: checkAccount.rows[0].name,
        token: tokenResult.rows[0].hash
    }

    var emailResult = await sendMail(email, 'Confirme seu Login', 'login', templateContext);

    if (emailResult.emailError) {
        res.status(503);
        res.json(errorResponse(503, null, emailResult));
        return;
    }

    const hiddenEmail = hideEmail(emailResult.accepted[0]);

    res.status(201);
    res.json(successResponse(201, `Token enviado para ${hiddenEmail}`));
    return;
}

export const login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const token = req.body.token;

    const validateInput = validateLoginInput(email, password, token);

    if (validateInput !== 'noErrors') {
        res.status(422);
        res.json(errorResponse(422, validateInput));
        return;
    }

    const checkAccount = await selectIdStatusByEmail(email);

    if (checkAccount.dbError) {
        res.status(503);
        res.json(errorResponse(503, null, checkAccount));
        return;
    } else if (!checkAccount.rows[0] || ((checkAccount.rows[0].status !== 'CONTA_ATIVA') && (checkAccount.rows[0].status !== 'CONTA_CRIADA'))) {
        res.status(404);
        res.json(errorResponse(404, "Nao e possivel localizar uma conta com o 'email' informado"));
        return;
    } else if (checkAccount.rows[0].status === 'CONTA_CRIADA') {
        res.status(400);
        res.json(errorResponse(400, "A conta informada nao esta ativa"));
        return;
    }

    var passwordResult = await accountPassword(checkAccount.rows[0].id, password);

    if (!passwordResult) {
        res.status(403);
        res.json(errorResponse(403, "Senha incorreta"));
    }

    const checkToken = await selectIdExpirationByAccount_id(checkAccount.rows[0].id);

    if (checkToken.dbError) {
        res.status(503);
        res.json(errorResponse(503, null, checkToken));
        return;
    }

    var actualTime = new Date()
    actualTime.setTime(actualTime.getTime());

    if (!checkToken.rows[0] || actualTime > checkToken.rows[0].expiration) {
        res.status(400);
        res.json(errorResponse(400, "Token expirado ou invalido"));
        return;
    }

    var confirmResult = await confirmToken(checkAccount.rows[0].id, 'LOGIN', token);

    if (confirmResult.dbError) {
        res.status(503);
        res.json(errorResponse(503, null, confirmResult));
        return;
    }

    if (confirmResult === false) {
        res.status(400);
        res.json(errorResponse(400, "Token expirado ou invalido"));
        return;
    }

    const lastAccess = await updateLast_accessByEmail(email);

    if (lastAccess.dbError) {
        res.status(503);
        res.json(errorResponse(503, null, lastAccess));
        return;
    }

    const jwtToken = sign({
        account_id: checkAccount.rows[0].id,
        email: email
    },
        process.env.JWT_KEY,
        {
            expiresIn: "1h"
        });

    const revokeResult = await revokeRefreshToken(checkAccount.rows[0].id);

    if (revokeResult.dbError) {
        res.status(503);
        res.json(errorResponse(503, null, revokeResult));
        return;
    }

    const refreshToken = await createRefreshToken(checkAccount.rows[0].id);

    if (refreshToken.dbError) {
        res.status(503);
        res.json(errorResponse(503, null, refreshToken));
        return;
    }

    const dataResponse = {
        "acesso": "garantido",
        "token": jwtToken,
        "refresh_token": refreshToken.rows[0].token
    };

    res.status(200);
    res.json(successResponse(200, dataResponse));
}