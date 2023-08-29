import { errorResponse } from "../middleware/responses/error.js";
import { validateId } from "../middleware/validate/id.js";
import { validateToken } from "../middleware/validate/token.js";
import { validateStringField } from "../middleware/validate/fieldFormat.js"
import { createToken } from "../middleware/token/token.js";
import { dbExecute } from "../src/configDB.js";
import { successResponse } from "../middleware/responses/success.js";

export const activateAccount = async (req, res, next) => {
    try {
        const action = req.body.action;
        const id = req.body.account_id;
        const token = req.body.token;
        var errorResp = [];

        if(!action) {
            errorResp.push({action: "O campo 'action' e obrigatorio"});
        } else {
            var validAction = validateStringField(action, 'action');
            if(validAction != 'valid') {
                errorResp.push(validAction);
            }
        }

        if(!id) {
            errorResp.push({"account_id": "O campo 'account_id' e obrigatorio"});
        } else {
            var validId = validateId(id, 'account_id');
            if (validId != 'valid') {
                errorResp.push(validId);
            } else {
                var query = `SELECT id FROM account WHERE id = $1`;
                var result = await dbExecute(query, [id]);
                
                if(result.dbError) {
                    res.status(503);
                    res.json(errorResponse(503, null, result));
                    return;
                } else if (!result.rows[0]) {
                    res.status(400);
                    res.json(errorResponse(400, "O 'acount_id' informado nao existe"));
                    return;
                }
            }
        }

        if(action === "validate_token") {
            if(!token) {
                errorResp.push({"token": "O campo 'token' e obrigatorio"});
            } else {
                var validToken = validateToken(token, 'token', 6);
                if (validToken != 'valid') {
                    errorResp.push(validToken);
                }
            }
        }

        if(errorResp.length > 0) {
            res.status(422);
            res.json(errorResponse(422, errorResp));
            return;
        }

        if(action === "create_token") {
            var query = `SELECT id, expiration FROM token WHERE account_id = $1 AND used = false ORDER BY id DESC LIMIT 20`;
            var result = await dbExecute(query, [id]);

            if(result.dbError) {
                res.status(503);
                res.json(errorResponse(503, null, result));
                return;
            } 
            
            var actualTime = new Date()
            actualTime.setTime(actualTime.getTime());

            result.rows.forEach(token => {
                if(token.expiration > actualTime) {
                    res.status(400);
                    res.json(errorResponse(400, "Ainda existe um token ativo para o 'acount_id' informado"));
                    return;
                }
            });

            var tokenResult = await createToken(id, 'VALIDATE_ACCOUNT', 2, 6);

            if(tokenResult.dbError) {
                res.status(503);
                res.json(errorResponse(503, null, tokenResult));
                return;
            } 

            if(tokenResult === 'criated') {
            
                //enviar email
            
                res.status(201);
                res.json(successResponse(201, 'token criado'));
            }
        }

    } catch (error) {
        
    }
}