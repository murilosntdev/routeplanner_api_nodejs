export const errorResponse = (statusCode, details, debugInfo) => {
    const response = {
        erro: {}
    };

    switch (statusCode) {
        case 400: {
            response.erro.status = 400;
            response.erro.mensagem = "O Servidor Recebeu Uma Solicitacao Incorreta";
            break;
        }
        case 422: {
            response.erro.status = 422;
            response.erro.mensagem = "Entidade não processavel"
            break;
        }
        default: {
            response.erro.status = 500;
            response.erro.mensagem = "Erro do Servidor Interno";
            break;
        }
    };

    if(details) response.erro.detalhes = details;
    if(debugInfo) response.erro.debugInfo = debugInfo;

    return(response);
}