export const validateToken = (content, fieldName, length) => {
    if (typeof content !== "string") {
        return { [fieldName]: `O campo '${fieldName}' deve ser uma string` };
    }
    if (content.length != length) {
        return { [fieldName]: `O campo '${fieldName}' deve conter ${length} caracteres'` };
    }

    return 'valid';
}