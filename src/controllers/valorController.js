import { valorSchema } from "../index.js";

import { usuarios, sessoes } from "../database/db.js";

import dayjs from "dayjs";

export async function getRegistros(req, res) {

    const registros = [
        { teste: "oi", data: "agora" },
    ];

    const { authorization } = req.headers; // Bearer Token
    //console.log("authorization", authorization);

    const token = authorization?.replace("Bearer ", ""); //Substitui o Bearer por nada, pois só precisa do token
    //console.log("token", token);

    if (!token) {
        return res.sendStatus(401);
    };

    try {
        const sessao = await sessoes.findOne({ token });
        console.log("sessao", sessao);

        const id = sessao?.usuarioId;

        const usuario = await usuarios.findOne({ _id: id });
        //console.log("usuario registro", usuario)

        if (!usuario) {
            return res.sendStatus(401);
        };

        delete usuario.password;

        //const transferencias = await transacoes.find({usuarioId: sessao.usuarioId}).toArray();

        //res.send({ transferencias, usuario });
        res.send("OK");

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

}

export async function postEntrada(req, res) {
    const { valor, descricao } = req.body;
    const infoUsuario = req.usuario;
    console.log("usuario entrada", infoUsuario);

    const dia = dayjs().format("DD/MM");

    const validation = valorSchema.validate(
        { valor, descricao },
        { abortEarly: false }
    );

    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(400).send(errors);
    };

    try {

        const entrada = {
            usuarioId: infoUsuario._id,
            type: "entrada",
            valor,
            descricao,
            dia
        }

        console.log("entrada", entrada);

        await transicoes.insertOne(entrada);

        res.send("OK");

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

}

export async function postSaida(req, res) {
    const { valor, descricao } = req.body;
    const infoUsuario = req.usuario;

    const dia = dayjs().format("DD/MM");

    const validation = valorSchema.validate(
        { valor, descricao },
        { abortEarly: false }
    );

    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(400).send(errors);
    };

    try {

        const saida = {
            usuarioId: infoUsuario._id,
            type: "saida",
            valor,
            descricao,
            dia
        }

        console.log("saidas", saida);

        await transicoes.insertOne(entrada);

        res.send("OK");

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

}