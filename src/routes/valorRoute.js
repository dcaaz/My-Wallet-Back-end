import { getRegistros, postEntrada, postSaida } from "../controllers/valorController.js";
import {Router} from "express";

const router = Router()

router.get("/registros", getRegistros);

router.post("/entrada", postEntrada);

router.post("/saida", postSaida);

export default router;