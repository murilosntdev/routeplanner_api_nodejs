import { selectIdNameStatusByEmail, selectIdExpirationByAccount_id, updateStatusById } from "../models/authTokenModel.js";
import { validateActivateAccountInput, validateRefreshTokenInput } from "../services/authTokenServices.js";
import { sendMail, hideEmail } from "../services/email/email.js";
import { createToken, confirmToken, createRefreshToken, confirmRefreshToken } from "../services/token/token.js";
import { errorResponse } from "../services/responses/error.js";
import { successResponse } from "../services/responses/success.js";
import jsonwebtoken from "jsonwebtoken";

const { sign } = jsonwebtoken;

export const activateAccount = async (req, res, next) => {
    const action = req.body.action;
    const email = req.body.account_email;
    const token = req.body.token;

    const validateInput = validateActivateAccountInput(action, email, token);

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
    } else if (checkAccount === "notFound") {
        res.status(400);
        res.json(errorResponse(400, "Nao existe uma conta com o email informado"));
        return;
    }

    if (action === "create_token") {
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

        if (checkAccount.rows[0].status !== 'CONTA_CRIADA') {
            res.status(400);
            res.json(errorResponse(400, "Nao pode ser gerado um token de ativacao para a conta informada"));
            return;
        }

        var tokenResult = await createToken(checkAccount.rows[0].id, 'VALIDATE_ACCOUNT', 6, 2);

        if (tokenResult.dbError) {
            res.status(503);
            res.json(errorResponse(503, null, tokenResult));
            return;
        }

        var templateContext = {
            name: checkAccount.rows[0].name,
            token: tokenResult.rows[0].hash
        }

        var emailResult = await sendMail(checkAccount.rows[0].email, 'Confirme seu Email', 'activateAccount', templateContext);

        if (emailResult.emailError) {
            res.status(503);
            res.json(errorResponse(503, null, emailResult));
            return;
        }

        const hiddenEmail = hideEmail(emailResult.accepted[0]);

        res.status(201);
        res.json(successResponse(201, `Token enviado para ${hiddenEmail}`));
        return;
    } else if (action === "validate_token") {
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

        var confirmResult = await confirmToken(checkAccount.rows[0].id, 'VALIDATE_ACCOUNT', token);

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

        const updateAccount = await updateStatusById(checkAccount.rows[0].id);

        if (updateAccount.dbError) {
            res.status(503);
            res.json(errorResponse(503, null, updateAccount));
            return;
        } else if (updateAccount.rows[0].status === 'CONTA_ATIVA') {
            res.status(200);
            res.json(successResponse(200, "Conta ativada com sucesso"));
            return;
        }
    } else {
        res.status(422);
        res.json(errorResponse(422, "O 'action' informado nao e invalido"));
        return;
    }
}

export const refreshToken = async (req, res, next) => {
    const token = req.body.token;

    const validateInput = validateRefreshTokenInput(token);

    if (validateInput !== 'noErrors') {
        res.status(422);
        res.json(errorResponse(422, validateInput));
        return;
    }

    const validateToken = await confirmRefreshToken(token);

    if (validateToken === 'notFound' || validateToken === 'overdue') {
        res.status(400);
        res.json(errorResponse(400, "Token expirado ou invalido"));
        return;
    }

    const jwtToken = sign({
        account_id: validateToken.account_id,
        email: validateToken.email
    },
        process.env.JWT_KEY,
        {
            expiresIn: "1h"
        }
    );

    const refreshToken = await createRefreshToken(validateToken.account_id);

    if (refreshToken.dbError) {
        res.status(503);
        res.json(errorResponse(503, null, refreshToken));
        return;
    }

    const dataResponse = {
        "token": jwtToken,
        "refresh_token": refreshToken.rows[0].token
    };

    res.status(200);
    res.json(successResponse(200, dataResponse));
}