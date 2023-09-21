import Router from "express";
import { createCompany } from "../controllers/account.js";
import { activateAccount } from "../controllers/authToken.js";
import { login } from "../controllers/login.js";

const router = Router();

router.get('/', (req, res) => {
    res.status(200);
    res.json({
        status: 200,
        mensagem: "API Rodando..."
    })
});

router.post('/createCompany', createCompany);
router.post('/activateAccount', activateAccount);
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