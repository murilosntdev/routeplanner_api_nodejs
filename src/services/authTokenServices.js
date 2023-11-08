import { validateEmail } from "../services/validators/emailValidator.js";
import { validateStringField } from "../services/validators/fieldFormatValidator.js";
import { validateToken } from "../services/validators/tokenValidator.js";

export const validateActivateAccountInput = (action, email, token) => {
    var inputErrors = [];

    if (!action) {
        inputErrors.push({ action: "O campo 'action' e obrigatorio" });
    } else {
        var validAction = validateStringField(action, 'action');
        if (validAction != 'valid') {
            inputErrors.push(validAction);
        }
    }

    if (!email) {
        inputErrors.push({ "account_email": "O campo 'account_email' e obrigatorio" });
    } else {
        var validEmail = validateEmail(email, "account_email");
        if (validEmail != 'valid') {
            inputErrors.push(validEmail);
        }
    }

    if (action === "validate_token") {
        if (!token) {
            inputErrors.push({ "token": "O campo 'token' e obrigatorio" });
        } else {
            var validToken = validateToken(token, 'token', 6);
            if (validToken != 'valid') {
                inputErrors.push(validToken);
            }
        }
    }

    if (inputErrors.length > 0) {
        return (inputErrors);
    }

    return 'noErrors';
}

export const validateRefreshTokenInput = (token) => {
    var inputErrors = [];

    if (!token) {
        inputErrors.push({ token: "O campo 'token' e obrigatorio" });
    } else {
        var validtoken = validateStringField(token, 'token');
        if (validtoken != 'valid') {
            inputErrors.push(validtoken);
        }
    }

    if (inputErrors.length > 0) {
        return (inputErrors);
    }

    return 'noErrors';
}