export const validatePassword = (password) => {
    const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;

    if(typeof password !== "string") {
        return {password: "O campo 'password' deve ser uma string"};
    }
    if(password.trim() === "") {
        return {password: "O campo 'password' e obrigatorio"};
    }
    if(password.length < 8 || password.length > 15) {
        return {password: "O campo 'password' deve conter de 8 a 15 caracteres"};
    }
    if(!regex.exec(password)) {
        return {password: "O campo 'password' precisa ser uma senha valida"};
    }

    return 'valid';
}