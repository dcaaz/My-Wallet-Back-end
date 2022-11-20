import { postCadastro, postLogin } from "../controllers/cadastroController.js";
import {Router} from "express";

const router = Router()

router.post("/cadastro", postCadastro);

router.post("/login", postLogin);

export default router;