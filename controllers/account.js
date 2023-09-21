import { dbExecute } from "../middleware/database/dbExecute.js";
import { errorResponse } from "../middleware/responses/error.js";
import { successResponse } from "../middleware/responses/success.js";
import { validateEmail } from "../middleware/validate/email.js";
import { validateCnpj } from "../middleware/validate/identityNumber.js";
import { validateCompanyName } from "../middleware/validate/name.js";
import { validatePassword } from "../middleware/validate/password.js";
import * as bcrypt from "bcrypt";

export const createCompany = async (req, res, next) => {
    try {
        const name = req.body.name;
        const cnpj = req.body.cnpj;
        const email = req.body.email;
        const password = req.body.password;

        var validationErrors = [];

        if (!name) {
            validationErrors.push({ name: "O campo 'name' e obrigatorio" });
        } else {
            var validName = validateCompanyName(name, 'name');
            if (validName != 'valid') {
                validationErrors.push(validName);
            }
        }

        if (!cnpj) {
            validationErrors.push({ cnpj: "O campo 'cnpj' e obrigatorio" });
        } else {
            var validCnpj = validateCnpj(cnpj, 'cnpj');
            if (validCnpj != 'valid') {
                validationErrors.push(validCnpj);
            }
        }

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

        var query = `SELECT id FROM account WHERE (cnpj = $1) OR (email = $2)`;
        var result = await dbExecute(query, [cnpj, email]);

        if (result.dbError) {
            res.status(503);
            res.json(errorResponse(503, null, result));
            return;
        } else if (result.rows[0]) {
            res.status(409);
            res.json(errorResponse(409, "Nao e possivel cadastrar um usuario com esses dados"));
            return;
        }

        const hashPassword = bcrypt.hashSync(password, 10);

        var query = `INSERT INTO account (name, role, cnpj, email, password, status) VALUES ($1, 'EMPRESA', $2, $3, $4, 'CONTA_CRIADA') RETURNING *`;
        var result = await dbExecute(query, [name, cnpj, email, hashPassword]);

        if (result.dbError) {
            res.status(503);
            res.json(errorResponse(503, null, result));
            return;
        } else if (result.rows[0]) {
            const responseMessage = {
                resultado: `Companhia '${result.rows[0].name}' criada com sucesso`,
                link: `${process.env.WEB_BASE_URL}u/${result.rows[0].id}`
            }

            res.status(201);
            res.json(successResponse(201, responseMessage));
            return;
        }
    } catch (error) {
        res.status(500);
        res.json(errorResponse(500, null, error));
    }
}