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
        case 409: {
            response.erro.status = 409;
            response.erro.mensagem = "Houve Um Conflito No Servidor"
            break;
        }
        case 422: {
            response.erro.status = 422;
            response.erro.mensagem = "Entidade Nao Processavel"
            break;
        }
        case 503: {
            response.erro.status = 503;
            response.erro.mensagem = "Serviço Insidponivel"
            break;
        }
        default: {
            response.erro.status = 500;
            response.erro.mensagem = "Erro do Servidor Interno";
            break;
        }
    };

    if(details) response.erro.detalhes = details;
    if(process.env.SHOW_DEBUG_INFO && debugInfo) response.erro.debugInfo = debugInfo;

    return(response);
}