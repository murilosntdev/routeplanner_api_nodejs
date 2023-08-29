export const validateToken = (content, fieldName, length) => {
    const regex = /^([0-9]*)([a-z]*)([A-Z]*)$/;

    if(typeof content !== "string") {
        return {[fieldName]: `O campo '${fieldName}' deve ser uma string`};
    }
    if(content.length != length) {
        return {[fieldName]: `O campo '${fieldName}' deve conter ${length} caracteres'`};
    }
    if(!regex.exec(content)) {
        return {[fieldName]: `O campo '${fieldName}' precisa ser um token valido`};
    }

    return 'valid';
}