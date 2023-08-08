import { errorResponse } from "../middleware/responses/error.js"
import { validateCompanyName } from "../middleware/validate/name.js";
import { validateCnpj } from "../middleware/validate/identityNumber.js";
import { validateEmail } from "../middleware/validate/email.js";
import { validatePassword } from "../middleware/validate/password.js";

export const createCompany = async (req, res, next) => {
    try {
        const name = req.body.name;
        const cnpj = req.body.cnpj;
        const email = req.body.email;
        const password = req.body.password;

        var errorResp = [];

        if(!name) {
            errorResp.push({name: "O campo 'name' e obrigatorio"});
        } else {
            var validName = validateCompanyName(name);
            if (validName != 'valid') {
                errorResp.push(validName);
            }
        }

        if(!cnpj) {
            errorResp.push({cnpj: "O campo 'cnpj' e obrigatorio"});
        } else {
            var validCnpj = validateCnpj(cnpj);
            if (validCnpj != 'valid') {
                errorResp.push(validCnpj);
            }
        }

        if(!email) {
            errorResp.push({email: "O campo 'email' e obrigatorio"});
        } else {
            var validEmail = validateEmail(email);
            if (validEmail != 'valid') {
                errorResp.push(validEmail);
            }
        }

        if(!password) {
            errorResp.push({password: "O campo 'password' e obrigatorio"});
        } else {
            var validPassword = validatePassword(password);
            if (validPassword != 'valid') {
                errorResp.push(validPassword);
            }
        }
        
        if (errorResp.length > 0) {
            res.status(422);
            res.json(errorResponse(422, errorResp));
        }
    
    } catch (error) {
    
    }
}