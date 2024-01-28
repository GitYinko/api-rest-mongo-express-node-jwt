//Controlador para las rutas de links donde vamos tener los metodos CRUD.

import { Link } from "../models/Link.js"
import { nanoid } from "nanoid";

//Controlador para leer todos los links (READ)
export const getLinks = async (req, res) => {

    try {

        const links = await Link.find({ uid: req.uid }).lean(); // vamos a filtrar con el campo uid del modelo Link. le estamos diciendo que nos traiga todos los links cuando el uid coinsida con el uid del cliente y traemos el uid del cliente mediante el middleware que le genero un propiedad uid al "req" con el valor del payload que contiene el uid del user, esto viene del "validationToken"

        return res.json({ links });

    } catch (error) {

        console.log(error)
        return res.status(500).json({ error: "Error del servidor" })
    }

}

//Controlador para buscar link por nanoid (READ)
export const getLink = async (req, res) => {

    try {
        const { nanoLink } = req.params; //traemos el parametro de la ruta.

        const link = await Link.findOne({ nanoLink }); // Buscamos por nanoLink del link para traer un link en especifico, es decir que si le pasamos el nanoLink del link valido nos tendria que traer la url que estamos buscando.


        //validamos si el link existe.
        if (!link) return res.status(404).json({ error: "No existe el link" })

        // if (!link.uid.equals(req.uid)) return res.status(404).json({ error: "No le pertenece ese link" })

        return res.json({ longLink: link.longLink });

    } catch (error) {

        console.log(error)

        if (error.kind === "ObjectId") {
            return res.status(404).json({ error: "Formato nanoLink incorrecto" })
        }

        return res.status(500).json({ error: "Error del servidor" })
    }

}


//Controlador para crear (CREATE)
export const createLink = async (req, res) => {

    try {

        let { longLink } = req.body;

        //ESTA CONDICION ES POR SI EL USUARIO NO MANDA LA URL EN FORMATO HTTPS
        //vamos a decirle que solo acepte urls seguras con el formato https://
        if (!longLink.startsWith("https://")) { // en esta condicion estamos dicien que si el comienzo de la url no es "https" entra al if para concatenar al value el https. startsWith nos permite detectar el comienzo de un string.

            longLink = "https://" + longLink;

        }

        //traemos las propiedades del modelo que son requqeridos para la creacion de datos(url)
        const link = new Link({ longLink, nanoLink: nanoid(7), uid: req.uid })// estamos creando datos en estas propiedades.

        const newLink = await link.save()//guardamos los nuevos datos

        return res.status(201).json({ newLink });


    } catch (error) {

        console.log(error)
        return res.status(500).json({ error: "Error del servidor" })

    }

}

//Controlador para eliminar link por nanoLink (DELETE)
export const removeLink = async (req, res) => {

    try {
        const { nanoLink } = req.params; //traemos el parametro de la ruta.

        const link = await Link.findOne({ nanoLink }); // Buscamos por nanoLink del link para traer un link en especifico, es decir que si le pasamos el nanoLink del link valido nos tendria que traer la url que estamos buscando.

        //validamos si el link existe.
        if (!link) { return res.status(404).json({ error: "No existe el link" }) }

        if (!link.uid.equals(req.uid)) { return res.status(404).json({ error: "No le pertenece ese link" }) }


        const deleteLink = await link.deleteOne();

        return res.json({ deleteLink });

    } catch (error) {

        console.log(error)

        if (error.kind === "ObjectId") {
            return res.status(404).json({ error: "Formato nanoLink incorrecto" })
        }

        return res.status(500).json({ error: "Error del servidor" })
    }

}

export const updateLink = async (req, res) => {

    try {

        const { nanoLink } = req.params; //traemos el parametro de la ruta.

        const { longLink } = req.body

        if (!longLink.startsWith("https://")) { // en esta condicion estamos dicien que si el comienzo de la url no es "https" entra al if para concatenar al value el https. startsWith nos permite detectar el comienzo de un string.

            longLink = "https://" + longLink;

        }

        const link = await Link.findOne({ nanoLink }); // Buscamos por nanoLink del link para traer un link en especifico, es decir que si le pasamos el nanoLink del link valido nos tendria que traer la url que estamos buscando.

        //validamos si el link existe.
        if (!link) { return res.status(404).json({ error: "No existe el link" }) }

        if (!link.uid.equals(req.uid)) { return res.status(404).json({ error: "No le pertenece ese link" }) }

        //actualizamos 
        link.longLink = longLink; // obtenemos el longLink de el modelo Link y le asignamos el longLink por el que queremos modificar.

        await link.save();// y depues lo guardamos.

        return res.json({ link });

    } catch (error) {
        console.log(error)
    }

}





