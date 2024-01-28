// Rutas de link, donde van a estar los metodos CRUD 

import { Router } from "express";
import { createLink, getLink, getLinks, removeLink, updateLink } from "../controllers/link_controller.js";
import { requireToken } from "../middlewares/validationToken.js";
import { linkValidator, paramNanoLinkValidator, tokenHeaderValidator } from "../middlewares/validatorManager.js";


const router = Router();

//GUIA

// GET      api/v1/links                all links
// GET      api/v1/links/:nanoLink      search link
// POST     api/v1/links                create link
// PATCH    api/v1/links                update link // el PATCH esta destinado a no modificar todo el objeto o esquema, pero si queremos modificar todo el esquema usamos PUT
// DELETE   api/v1/links/:nanoLink      remove link


//RUTAS CRUD

//Ruta de lectura (READ).
router.get("/", tokenHeaderValidator, requireToken, getLinks)

//Ruta para search(READ).
router.get("/:nanoLink", getLink) //esta ruta no tiene validaciones del token por que es una ruta publica. Es decir, que cualquiera puede tener acceso a esta ruta de busqueda.

//Ruta de crear (CREATE)
router.post("/", tokenHeaderValidator, requireToken, linkValidator, createLink)

//ruta para remover o eliminar (DELETE)
router.delete("/:nanoLink", requireToken, paramNanoLinkValidator, removeLink)

//Ruta para actualizar o modificar el link mediante PATCH que nos sirve para modificar algunas propiedades pero no el objeto entero, para ello es el PUT.(UPDATE)
router.patch("/:nanoLink", requireToken, paramNanoLinkValidator, linkValidator, updateLink)







export default router;