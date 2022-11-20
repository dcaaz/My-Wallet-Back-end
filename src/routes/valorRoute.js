import { getRegistros, postEntrada, postSaida } from "../controllers/valorController.js";
import {Router} from "express";
import { tokenValidacao } from "../middlewares/tokenValidacaoMiddleware.js";

const router = Router()

router.get("/registros", tokenValidacao, getRegistros);

router.post("/entrada", tokenValidacao, postEntrada);

router.post("/saida", tokenValidacao, postSaida);

export default router;