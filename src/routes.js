import { createCompany } from "./controllers/accountController.js";
import { activateAccount, refreshToken } from "./controllers/authTokenController.js";
import { preLogin, login } from "./controllers/sessionController.js";
import Router from "express";

const router = Router();

router.get('/', (req, res) => {
    res.status(200);
    res.json({
        status: 200,
        mensagem: "RoutePlanner API rodando normalmente..."
    })
});

router.post('/createCompany', createCompany);
router.post('/activateAccount', activateAccount);
router.post('/refreshToken', refreshToken);
router.post('/preLogin', preLogin);
router.post('/login', login);

router.use((req, res, next) => {
    const error = new Error("Página Não Encontrada");
    error.statusCode = 404;
    next(error);
});

router.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    res.status(statusCode);
    res.json({
        erro: {
            status: statusCode,
            mensagem: message
        }
    });
});

export default router;