import express from "express";
import cors from "cors";
import router from './routes.js'
import * as dotenv from "dotenv";

dotenv.config();

const port = process.env.EXPRESS_PORT;
const app = express();

app.use(express.json())
app.use(
    cors({
        origin: process.env.CORS_ORIGIN
    })
);
app.use(router);

app.listen(port, () => console.log("Servidor Rodando..."));