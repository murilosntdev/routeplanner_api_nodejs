export const successResponse = (statusCode, details) => {
    const response = {};

    switch (statusCode) {
        case 200: {
            response.status = 200;
            response.mensagem = "OK";
            break;
        }
        case 201: {
            response.status = 201;
            response.mensagem = "Entidade Criada";
            break;
        }
        default: {
            response.status = 204;
            response.mensagem = "Sem Conteúdo";
            break;
        }
    };

    if(details) response.detalhes = details;

    return(response);
} 