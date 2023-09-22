import { validateCnpj } from "./validators/docNumberValidator.js";
import { validateEmail } from "./validators/emailValidator.js";
import { validateCompanyName } from "./validators/nameValidator.js";
import { validatePassword } from "./validators/passwordValidator.js";

export const validateCreateCompanyInput = (name, cnpj, email, password) => {
    var inputErrors = [];

    if (!name) {
        inputErrors.push({ name: "O campo 'name' e obrigatorio" });
    } else {
        var validCompanyName = validateCompanyName(name, 'name');
        if (validCompanyName != 'valid') {
            inputErrors.push(validCompanyName);
        }
    }

    if (!cnpj) {
        inputErrors.push({ cnpj: "O campo 'cnpj' e obrigatorio" });
    } else {
        var validCnpj = validateCnpj(cnpj, 'cnpj');
        if (validCnpj != 'valid') {
            inputErrors.push(validCnpj);
        }
    }

    if (!email) {
        inputErrors.push({ email: "O campo 'email' e obrigatorio" });
    } else {
        var validEmail = validateEmail(email, 'email');
        if (validEmail != 'valid') {
            inputErrors.push(validEmail);
        }
    }

    if (!password) {
        inputErrors.push({ password: "O campo 'password' e obrigatorio" });
    } else {
        var validPassword = validatePassword(password, 'password');
        if (validPassword != 'valid') {
            inputErrors.push(validPassword);
        }
    }

    if (inputErrors.length > 0) {
        return (inputErrors);
    }

    return 'noErrors';
}