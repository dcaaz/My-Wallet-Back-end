import { valorSchema } from "../models/valorModels.js";

import { transacoes } from "../database/db.js";

import dayjs from "dayjs";

export async function getRegistros(req, res) {

    const usuario = req.usuario;

     try {

        delete usuario.password;

        const transacao = await transacoes.find({usuarioId: usuario._id}).toArray();

        res.send({usuario, transacao});

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

}

export async function postEntrada(req, res) {
    const { valor, descricao } = req.body;
    const usuario = req.usuario;

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

        await transacoes.insertOne(saida);

        res.sendStatus(201);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

}