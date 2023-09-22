import { selectIdByCnpjEmail, insertAllCompany } from "../models/accountModel.js"
import { validateCreateCompanyInput } from "../services/accountServices.js"
import { errorResponse } from "../services/responses/error.js";
import { successResponse } from "../services/responses/success.js";
import * as bcrypt from "bcrypt";

export const createCompany = async (req, res, next) => {
    const name = req.body.name;
    const cnpj = req.body.cnpj;
    const email = req.body.email;
    const password = req.body.password;

    const validateInput = validateCreateCompanyInput(name, cnpj, email, password);

    if (validateInput !== 'noErrors') {
        res.status(422);
        res.json(errorResponse(422, validateInput));
        return;
    }
    const checkExistence = await selectIdByCnpjEmail(cnpj, email);

    if (checkExistence.dbError) {
        res.status(503);
        res.json(errorResponse(503, null, checkExistence));
        return;
    } else if (checkExistence === "AlreadyExists") {
        res.status(409);
        res.json(errorResponse(409, "Nao e possivel cadastrar um usuario com esses dados"));
        return;
    }

    const hashPassword = bcrypt.hashSync(password, 10);

    const registerInfos = await insertAllCompany(name, "EMPRESA", cnpj, email, hashPassword, "CONTA_CRIADA");

    if (registerInfos.dbError) {
        res.status(503);
        res.json(errorResponse(503, null, registerInfos));
        return;
    }

    const responseMessage = {
        resultado: `Companhia '${name}' criada com sucesso`,
        link: `${process.env.WEB_BASE_URL}u/${registerInfos.id}`
    }

    res.status(201);
    res.json(successResponse(201, responseMessage));
    return;
}