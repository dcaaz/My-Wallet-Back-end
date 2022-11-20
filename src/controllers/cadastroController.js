import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";

import { cadastroSchema } from "../index.js";

import { usuarios, sessoes } from "../database/db.js";


export async function postCadastro (req, res) {

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

};

export async function postLogin (req, res) {

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

};