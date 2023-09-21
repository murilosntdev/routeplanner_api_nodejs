import { dbExecute } from "../middleware/database/dbExecute.js";
import { errorResponse } from "../middleware/responses/error.js";
import { validateEmail } from "../middleware/validate/email.js";
import { validatePassword } from "../middleware/validate/password.js";
import { accountPassword } from "../middleware/password/password.js";
import { successResponse } from "../middleware/responses/success.js";
import jsonwebtoken from "jsonwebtoken";

const { sign } = jsonwebtoken;

export const login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        var validationErrors = [];

        if (!email) {
            validationErrors.push({ email: "O campo 'email' e obrigatorio" });
        } else {
            var validEmail = validateEmail(email, 'email');
            if (validEmail != 'valid') {
                validationErrors.push(validEmail);
            }
        }

        if (!password) {
            validationErrors.push({ password: "O campo 'password' e obrigatorio" });
        } else {
            var validPassword = validatePassword(password, 'password');
            if (validPassword != 'valid') {
                validationErrors.push(validPassword);
            }
        }

        if (validationErrors.length > 0) {
            res.status(422);
            res.json(errorResponse(422, validationErrors));
            return;
        }
        
        var query = `SELECT id, name, password, status FROM account WHERE email = $1`;
        var accountResult = await dbExecute(query, [email]);
        
        if (accountResult.dbError) {
            res.status(503);
            res.json(errorResponse(503, null, accountResult));
            return;
        } else if (!accountResult.rows[0] || ((accountResult.rows[0].status !== 'CONTA_ATIVA') && (accountResult.rows[0].status !== 'CONTA_CRIADA'))) {
            res.status(404);
            res.json(errorResponse(404, "Nao e possivel localizar uma conta com o 'email' informado"));
            return;
        } else if (accountResult.rows[0].status === 'CONTA_CRIADA') {
            res.status(400);
            res.json(errorResponse(400, "A conta informada nao esta ativa"));
            return;
        }

        var passwordResult = await accountPassword(accountResult.rows[0].id, password);

        if(!passwordResult) {
            res.status(403);
            res.json(errorResponse(403, "Senha incorreta"));
        }

        const jwtToken = sign({
            account_id: accountResult.rows[0].id,
            email: email
        },
        process.env.JWT_KEY,
        {
            expiresIn: "1h"
        });

        const dataResponse = {
            "acesso": "garantido",
            "token": jwtToken
        };

        res.status(200);
        res.json(successResponse(200, dataResponse));

    } catch (error) {
        
    }
}