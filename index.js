import express, { json } from "express";
import cors from 'cors';
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
import joi from "joi";

const cadastroSchema = joi.object({
    nome: joi.string().required().min(3),
    email: joi.string().required().min(3),
    senha: joi.string().required().min(3),
});

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); //receber req do cliente no formato json

const mongoClient = new MongoClient("mongodb://localhost:27017"); //porta do mongo

try {
    await mongoClient.connect();
    console.log("MongoDB conectado!");
} catch (err) {
    console.log("err mongoDB", err);
};

const db = mongoClient.db("myWallet");

const users = db.collection("usuarios");

app.post("/cadastro", async (req, res) => {

    const { nome, email, senha } = req.body;

    const validation = cadastroSchema.validate(
        { nome, email, senha },
        { abortEarly: false }
    );

    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(422).send(errors);
    };

    const novoPerfil =
    {
        nome,
        email,
        senha
    };

    try {
        await users.insertOne(novoPerfil); // inserindo no mongo
        res.sendStatus(201);
    } catch (err) { //se der errado
        res.sendStatus(500);
    };

});



app.listen(5000, () => {
    console.log("Serving running in port: 5000");
}); //verifica/"escuta" se tem alguma solicitação para acessar a porta