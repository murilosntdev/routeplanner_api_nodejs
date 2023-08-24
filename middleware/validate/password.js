export const validatePassword = (content, fieldName) => {
    const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;

    if(typeof content !== "string") {
        return {[fieldName]: `O campo '${fieldName}' deve ser uma string`};
    }
    if(content.trim() === "") {
        return {[fieldName]: `O campo '${fieldName}' e obrigatorio`};
    }
    if(content.length < 8 || content.length > 15) {
        return {[fieldName]: `O campo '${fieldName}' deve conter de 8 a 15 caracteres`};
    }
    if(!regex.exec(content)) {
        return {[fieldName]: `O campo '${fieldName}' precisa ser uma senha valida`};
    }

    return 'valid';
}