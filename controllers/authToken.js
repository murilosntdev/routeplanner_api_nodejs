import { errorResponse } from "../middleware/responses/error.js";
import { validateId } from "../middleware/validate/id.js";
import { validateToken } from "../middleware/validate/token.js";
import { validateStringField } from "../middleware/validate/fieldFormat.js"
import { confirmToken, createToken } from "../middleware/token/token.js";
import { successResponse } from "../middleware/responses/success.js";
import { sendMail } from "../middleware/email/sendMail.js";
import { hiddenEmail } from "../middleware/hidden/hiddenInfos.js";
import { dbExecute } from "../middleware/database/dbExecute.js";

export const activateAccount = async (req, res, next) => {
    try {
        const action = req.body.action;
        const id = req.body.account_id;
        const token = req.body.token;

        var validationErrors = [];

        if (!action) {
            validationErrors.push({ action: "O campo 'action' e obrigatorio" });
        } else {
            var validAction = validateStringField(action, 'action');
            if (validAction != 'valid') {
                validationErrors.push(validAction);
            }
        }

        if (!id) {
            validationErrors.push({ "account_id": "O campo 'account_id' e obrigatorio" });
        } else {
            var validId = validateId(id, 'account_id');
            if (validId != 'valid') {
                validationErrors.push(validId);
            } else {
                var query = `SELECT id, name, email, status FROM account WHERE id = $1`;
                var accountResult = await dbExecute(query, [id]);

                if (accountResult.dbError) {
                    res.status(503);
                    res.json(errorResponse(503, null, result));
                    return;
                } else if (!accountResult.rows[0]) {
                    res.status(400);
                    res.json(errorResponse(400, "O 'acount_id' informado nao existe"));
                    return;
                }
            }
        }

        if (action === "validate_token") {
            if (!token) {
                validationErrors.push({ "token": "O campo 'token' e obrigatorio" });
            } else {
                var validToken = validateToken(token, 'token', 6);
                if (validToken != 'valid') {
                    validationErrors.push(validToken);
                }
            }
        }

        if (validationErrors.length > 0) {
            res.status(422);
            res.json(errorResponse(422, validationErrors));
            return;
        }

        if (action === "create_token") {
            var query = `SELECT id, expiration FROM token WHERE account_id = $1 AND category = 'VALIDATE_ACCOUNT' AND used = false ORDER BY id DESC LIMIT 1`;
            var result = await dbExecute(query, [id]);

            if (result.dbError) {
                res.status(503);
                res.json(errorResponse(503, null, result));
                return;
            }

            var actualTime = new Date()
            actualTime.setTime(actualTime.getTime());

            if (result.rows[0] && result.rows[0].expiration > actualTime) {
                res.status(400);
                res.json(errorResponse(400, "Ainda existe um token ativo para o 'acount_id' informado"));
                return;
            }

            if (accountResult.rows[0].status !== 'CONTA_CRIADA') {
                res.status(400);
                res.json(errorResponse(400, "Nao pode ser gerado um token de ativacao para o 'account_id' informado"));
                return;
            }

            var tokenResult = await createToken(id, 'VALIDATE_ACCOUNT', 6, 2);

            if (tokenResult.dbError) {
                res.status(503);
                res.json(errorResponse(503, null, tokenResult));
                return;
            }

            var templateContext = {
                name: accountResult.rows[0].name,
                token: tokenResult.rows[0].hash
            }

            var emailResult = await sendMail(accountResult.rows[0].email, 'Confirme seu Email', 'activateAccount', accountResult.rows[0].name, tokenResult.rows[0].hash, templateContext);

            if (emailResult.emailError) {
                res.status(503);
                res.json(errorResponse(503, null, emailResult));
                return;
            }

            const hidden = hiddenEmail(emailResult.accepted[0]);

            res.status(201);
            res.json(successResponse(201, `Token enviado para ${hidden}`));
            return;
        } else if (action == "validate_token") {
            var query = `SELECT id, expiration FROM token WHERE account_id = $1 AND category = 'VALIDATE_ACCOUNT' AND used = false ORDER BY id DESC LIMIT 1`;
            var result = await dbExecute(query, [id]);

            if (result.dbError) {
                res.status(503);
                res.json(errorResponse(503, null, result));
                return;
            }

            var actualTime = new Date()
            actualTime.setTime(actualTime.getTime());

            if (!result.rows[0] || actualTime > result.rows[0].expiration) {
                res.status(400);
                res.json(errorResponse(400, "Token expirado ou invalido"));
                return;
            }

            var confirmResult = await confirmToken(id, 'VALIDATE_ACCOUNT', token);

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

            var query = `UPDATE account SET status = 'CONTA_ATIVA' WHERE id = $1 RETURNING status`;
            var result = await dbExecute(query, [id]);

            if (result.dbError) {
                res.status(503);
                res.json(errorResponse(503, null, result));
                return;
            } else if (result.rows[0].status === 'CONTA_ATIVA') {
                res.status(200);
                res.json(successResponse(200, `Conta ativada com sucesso`));
                return;
            }
        } else {
            res.status(422);
            res.json(errorResponse(422, "O 'action' informado nao e invalido"));
            return;
        }
    } catch (error) {
        res.status(500);
        res.json(errorResponse(500, null, error));
    }
}