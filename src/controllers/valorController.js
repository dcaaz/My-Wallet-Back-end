import { valorSchema } from "../index.js";

import { transacoes, usuarios } from "../database/db.js";

import dayjs from "dayjs";

export async function getRegistros(req, res) {

    const usuario = req.usuario;
    console.log("req usuario", usuario)

     try {

        delete usuario.password;

        const transacao = await transacoes.find({usuarioId: usuario._id}).toArray();

        console.log("transacao", transacao)

        res.send({usuario, transacao});

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

}

export async function postEntrada(req, res) {
    const { valor, descricao } = req.body;
    const usuario = req.usuario;
    console.log("usuario entrada", usuario);

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
            usuarioId: usuario._id,
            type: "entrada",
            valor,
            descricao,
            dia
        }

        console.log("entrada", entrada);

        await transacoes.insertOne(entrada);

        res.sendStatus(201);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

}

export async function postSaida(req, res) {
    const { valor, descricao } = req.body;
    const usuario = req.usuario;
    console.log("usuario saida", usuario);

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
            usuarioId: usuario._id,
            type: "saida",
            valor,
            descricao,
            dia
        }

        console.log("saidas", saida);

        await transacoes.insertOne(saida);

        res.sendStatus(201);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

}