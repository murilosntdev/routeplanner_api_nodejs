export const errorResponse = (statusCode, details, debugInfo) => {
    const response = {
        erro: {}
    };

    switch (statusCode) {
        case 400: {
            response.erro.status = 400;
            response.erro.mensagem = "O Servidor Recebeu Uma Solicitação Incorreta";
            break;
        }
        default: {
            response.erro.status = 500;
            response.erro.mensagem = "Erro do Servidos Interno";
            break;
        }
    };

    if(details) response.erro.detalhes = details;
    if(debugInfo) response.erro.debugInfo = debugInfo;

    return(response);
}