import { validateEmail } from "./validators/emailValidator.js";
import { validateStringField } from "./validators/fieldFormatValidator.js";
import { validatePassword } from "./validators/passwordValidator.js";
import { validateToken } from "./validators/tokenValidator.js";

const emailField = (email) => {
    if (!email) {
        return ({ email: "O campo 'email' e obrigatorio" });
    }

    var validEmail = validateEmail(email, 'email');

    return (validEmail);
}

const passwordField = (password) => {
    if (!password) {
        return ({ password: "O campo 'password' e obrigatorio" });
    }

    var validPassword = validatePassword(password, 'password');

    return (validPassword);
}

export const validatePreLoginInput = (email, password) => {
    var inputErrors = [];

    var validEmail = emailField(email);

    if (validEmail !== 'valid') {
        inputErrors.push(validEmail);
    }

    var validPassword = passwordField(password);

    if (validPassword !== 'valid') {
        inputErrors.push(validPassword);
    }

    if (inputErrors.length > 0) {
        return (inputErrors);
    }

    return 'noErrors';
}

export const validateLoginInput = (email, password, token) => {
    var inputErrors = [];

    var validEmail = emailField(email);

    if (validEmail !== 'valid') {
        inputErrors.push(validEmail);
    }

    var validPassword = passwordField(password);

    if (validPassword !== 'valid') {
        inputErrors.push(validPassword);
    }

    if (!token) {
        inputErrors.push({ "token": "O campo 'token' e obrigatorio" });
    } else {
        var validToken = validateToken(token, 'token', 4);
        if (validToken != 'valid') {
            inputErrors.push(validToken);
        }
    }

    if (inputErrors.length > 0) {
        return (inputErrors);
    }

    return 'noErrors';
}

export const validateLogoutHeader = (token) => {
    var inputErrors = [];

    if (!token) {
        inputErrors.push({ token: "O campo 'Authorization' e obrigatorio" });
    } else {
        var validAuthorization = validateStringField(token, 'Authorization');
        if (validAuthorization != 'valid') {
            inputErrors.push(validAuthorization);
        }
    }

    if (inputErrors.length > 0) {
        return (inputErrors);
    }

    return 'noErrors';
}