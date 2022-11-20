import express, { json, response } from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import joi from "joi";

import { postCadastro, postLogin } from "./controllers/cadastroController.js";
import { getRegistros, postEntrada, postSaida } from "./controllers/valorController.js";

export const cadastroSchema = joi.object({
    nome: joi.string().required().min(3),
    email: joi.string().email().required(),
    senha: joi.string().required(),
});

export const valorSchema = joi.object({
    valor: joi.string().required(),
    descricao: joi.string().required().max(100)
});

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); //receber req do cliente no formato json

app.post("/cadastro", postCadastro);

app.post("/login", postLogin);

app.get("/registros", getRegistros);

app.post("/entrada", postEntrada);

app.post("/saida", postSaida);

app.listen(5000, () => {
    console.log("Serving running in port: 5000");
}); //verifica/"escuta" se tem alguma solicitação para acessar a porta