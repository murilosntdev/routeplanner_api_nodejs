export const validateId = (content, fieldName) => {
    const regex = /^[0-9]*$/;

    if(typeof content !== "number") {
        return {[fieldName]: `O campo '${fieldName}' deve ser numerico`};
    }
    
    if(!regex.exec(content)) {
        return {[fieldName]: `O campo '${fieldName}' precisa ser um identificador valido`};
    }

    return 'valid';
}