export const validateEmail = (content, fieldName) => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (typeof content !== "string") {
        return { [fieldName]: `O campo '${fieldName}' deve ser uma string` };
    }
    if (content.trim() === "") {
        return { [fieldName]: `O campo '${fieldName}' e obrigatorio` };
    }
    if (content.length < 5 || content.length > 100) {
        return { [fieldName]: `O campo '${fieldName}' deve conter de 5 a 100 caracteres` };
    }
    if (!regex.exec(content)) {
        return { [fieldName]: `O campo '${fieldName}' precisa ser um email valido` };
    }

    return 'valid';
}