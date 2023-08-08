export const validateCompanyName = (name) => {
    const regex = /^\w[\w.\-#&\s]*$/;
    
    if(typeof name !== "string") {
        return {name: "O campo 'name' deve ser uma string"};
    }
    if(name.trim() === "") {
        return {name: "O campo 'name' e obrigatorio"};
    }
    if(name.length < 5 || name.length > 100) {
        return {name: "O campo 'name' deve conter de 5 a 100 caracteres"};
    }
    if(!regex.exec(name)) {
        return {name: "O campo 'name' contem caracteres invalidos"};
    }
    
    return 'valid';
}