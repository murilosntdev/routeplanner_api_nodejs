export const validateEmail = (email) => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if(typeof email !== "string") {
        return {email: "O campo 'email' deve ser uma string"};
    }
    if(email.trim() === "") {
        return {email: "O campo 'email' e obrigatorio"};
    }
    if(email.length < 5 || email.length > 100) {
        return {email: "O campo 'email' deve conter de 5 a 100 caracteres"};
    }
    if(!regex.exec(email)) {
        return {email: "O campo 'email' precisa ser um email valido"};
    }

    return 'valid';
}