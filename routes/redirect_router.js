import { Router } from "express";
import { redirectLink } from "../controllers/redirect_controller.js";

const router = Router()

router.get("/:nanoLink", redirectLink) //Ruta que se va a encargar de hacer el reditreccionamiento mediante el param nanolink que va hacer la busqueda en nuestra DB


export default router