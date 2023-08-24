export const validateCnpj = (content, fieldName) => {
    const regex = /^[0-9]{14}$/;

    if(typeof content !== 'string') {
        return {[fieldName]: `O campo '${fieldName}' deve ser uma string numerica`};
    }
    if(content.trim() === "") {
        return {[fieldName]: `O campo '${fieldName}' e obrigatorio`};
    }
    if(content.length != 14) {
        return {[fieldName]: `O campo '${fieldName}' deve conter de 14 caracteres numericos`};
    }
    if(!regex.exec(content)) {
        return {[fieldName]: `O campo '${fieldName}' contem caracteres invalidos`};
    }
    if (content == "00000000000000" || content == "11111111111111" || content == "22222222222222" || content == "33333333333333" || content == "44444444444444" || content == "55555555555555" || content == "66666666666666" || content == "77777777777777" || content == "88888888888888" || content == "99999999999999") {
        return {[fieldName]: `O campo '${fieldName}' precisa ser um CNPJ valido`};
    }

    var cnpjLength = content.length - 2
    var cnpjNumber = content.substring(0,cnpjLength);
    var verifDigit = content.substring(cnpjLength);
    var sum = 0;
    var pos = cnpjLength - 7;
    
    for (var i = cnpjLength; i >= 1; i--) {
        sum += cnpjNumber.charAt(cnpjLength - i) * pos--;
      
        if (pos < 2) {
            pos = 9;
        }
    }

    var result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    
    if (result != verifDigit.charAt(0)) {
        return {[fieldName]: `O campo '${fieldName}' precisa ser um CNPJ valido`};
    }
    
    cnpjLength = cnpjLength + 1;
    cnpjNumber = content.substring(0,cnpjLength);
    sum = 0;
    pos = cnpjLength - 7;
    
    for (var i = cnpjLength; i >= 1; i--) {
        sum += cnpjNumber.charAt(cnpjLength - i) * pos--;
        
        if (pos < 2) {
            pos = 9;
        }
    }

    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    
    if (result != verifDigit.charAt(1)) {
        return {[fieldName]: `O campo '${fieldName}' precisa ser um CNPJ valido`};
    }

    return 'valid';
}