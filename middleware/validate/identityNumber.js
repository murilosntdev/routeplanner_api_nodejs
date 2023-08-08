export const validateCnpj = (cnpj) => {
    const regex = /^[0-9]{14}$/;

    if(typeof cnpj !== 'string') {
        return {cnpj: "O campo 'cnpj' deve ser uma string numerica"};
    }
    if(cnpj.trim() === "") {
        return {cnpj: "O campo 'cnpj' e obrigatorio"};
    }
    if(cnpj.length != 14) {
        return {cnpj: "O campo 'cnpj' deve conter de 14 caracteres numericos"};
    }
    if(!regex.exec(cnpj)) {
        return {cnpj: "O campo 'cnpj' contem caracteres invalidos"};
    }
    if (cnpj == "00000000000000" || cnpj == "11111111111111" || cnpj == "22222222222222" || cnpj == "33333333333333" || cnpj == "44444444444444" || cnpj == "55555555555555" || cnpj == "66666666666666" || cnpj == "77777777777777" || cnpj == "88888888888888" || cnpj == "99999999999999") {
        return {cpnj: "O campo 'cnpj' precisa ser um CNPJ valido"};
    }

    var cnpjLength = cnpj.length - 2
    var cnpjNumber = cnpj.substring(0,cnpjLength);
    var verifDigit = cnpj.substring(cnpjLength);
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
        return {cpnj: "O campo 'cnpj' precisa ser um CNPJ valido"};
    }
    
    cnpjLength = cnpjLength + 1;
    cnpjNumber = cnpj.substring(0,cnpjLength);
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
        return {cpnj: "O campo 'cnpj' precisa ser um CNPJ valido"};
    }

    return 'valid';
}