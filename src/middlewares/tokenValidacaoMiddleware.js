import { sessoes, usuarios } from "../database/db.js";

export async function tokenValidacao(req, res, next){ //função interceptadora

    const { authorization } = req.headers;

    const token = authorization?.replace("Bearer ", "");

    if (!token) {
        return res.sendStatus(401);
    }

    try{

        const sessao = await sessoes.findOne({token});

        if(!sessao){
            return res.sendStatus(401);
        }

        const id = sessao?.usuarioId;

        const usuario = await usuarios.findOne({ _id: id});

        if (!usuario) {
            return res.sendStatus(401);
        }

        req.usuario = usuario;

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }

    next();
}