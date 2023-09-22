export const validateObjectField = (content, fieldName) => {
    if (typeof content !== "object" || Array.isArray(content)) {
        return { [fieldName]: `O campo '${fieldName}' deve ser um objeto` };
    }
    if (Object.keys(content).length === 0) {
        return { [fieldName]: `O campo '${fieldName}' nao pode ser vazio` };
    }

    return 'valid';
}

export const validateStringField = (content, fieldName) => {
    if (typeof content !== "string") {
        return { [fieldName]: `O campo '${fieldName}' deve ser uma string` };
    }

    if (content.trim() === "") {
        return { [fieldName]: `O campo '${fieldName}' e obrigatorio` };
    }

    return 'valid';
}