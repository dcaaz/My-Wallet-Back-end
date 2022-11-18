import express, { json } from "express";
import cors from 'cors';
import { AutoEncryptionLoggerLevel, MongoClient } from "mongodb";
import dotenv from 'dotenv';
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";

const cadastroSchema = joi.object({
    nome: joi.string().required().min(3),
    email: joi.string().email().required(),
    senha: joi.string().required(),
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

const usuarios = db.collection("usuarios");
const sessoes = db.collection("sessoes");

app.post("/cadastro", async (req, res) => {

    const { nome, email, senha } = req.body;

    try {

        const usuarioExiste = await usuarios.findOne({ email });

        if (usuarioExiste) {
            return res.status(401).send({ message: "Esse usuário já existe" });
        }

        const validation = cadastroSchema.validate(
            { nome, email, senha },
            { abortEarly: false }
        );

        if (validation.error) {
            const errors = validation.error.details.map(detail => detail.message);
            return res.status(400).send(errors);
        };

        const esconderSenha = bcrypt.hashSync(senha, 10); //criptografar
        console.log("esconderSenha", esconderSenha);

        const novoPerfil =
        {
            nome,
            email,
            senha: esconderSenha,
        };

        await usuarios.insertOne(novoPerfil); // inserindo no mongo
        res.sendStatus(201);
    } catch (err) { //se der errado
        res.sendStatus(500);
    };

});

app.post("/login", async (req, res) => {

    const { email, senha } = req.body;

    const token = uuidV4();

    try {

        const usuarioExiste = await usuarios.findOne({ email });

        if (!usuarioExiste) {
            return res.status(401).send({ message: "Esse usuário não existe" });
        };

        const senhaOk = bcrypt.compareSync(senha, usuarioExiste.senha); //comparando a senha recebida com a senha do banco de dados
        console.log("senhaOk", senhaOk);

        if (!senhaOk) {
            return res.status(400).send({ message: "Senha incorreta" });
        }

        // Verificar se o user já possui uma sessão aberta
        const sessaoUsuario = await sessoes.findOne({ userId: usuarioExiste._id });

        console.log(sessaoUsuario);
        if (sessaoUsuario) {
            return res.status(401).send({ message: "Você já está logado, saia para logar novamente" });
        };


        // Se não tiver sessão aberta, abre uma nova
        await sessoes.insertOne({
            token,
            usuarioId: usuarioExiste._id
        });

        res.send({ token });

    } catch (err) {
        console.log("err", err)
        res.sendStatus(500);
    };

});

app.get("/registros", async (req, res) => {

    const registros = [
        { teste: "oi", data: "agora" },
    ];

    const { authorization } = req.headers; // Bearer Token
    console.log("authorization", authorization);

    const token = authorization?.replace("Bearer ", ""); //Substitui o Bearer por nada, pois só precisa do token
    console.log("token", token);

    if (!token) {
        return res.sendStatus(401);
    };

    try {
        const sessao = await sessoes.findOne({ token });
        console.log("sessao", sessao);

        const id = sessao?.usuarioId;

        const usuario = await usuarios.findOne({ _id: id });
        console.log("usario", usuario)

        if (!usuario) {
            return res.sendStatus(401);
        }; 

        delete usuario.password;

        res.send({ registros, usuario });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

});

app.listen(5000, () => {
    console.log("Serving running in port: 5000");
}); //verifica/"escuta" se tem alguma solicitação para acessar a porta