import express, { json, response } from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import transferenciaRouter from "./routes/valorRoute.js";
import usuarioRouter from "./routes/cadastroRoute.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); //receber req do cliente no formato json
app.use(transferenciaRouter);
app.use(usuarioRouter);

app.listen(5000, () => {
    console.log("Serving running in port: 5000");
}); //verifica/"escuta" se tem alguma solicitação para acessar a porta