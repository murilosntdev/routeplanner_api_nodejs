import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

dotenv.config();

const port = process.env.EXPRESS_PORT;
const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN
    })
);

app.listen(port, () => console.log("Servidor Rodando..."));