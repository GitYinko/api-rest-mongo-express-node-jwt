import { Link } from "../models/Link.js";

export const redirectLink = async (req, res) => {

    try {
        const { nanoLink } = req.params; //traemos el parametro de la ruta.

        const link = await Link.findOne({ nanoLink }); // Buscamos por nanoLink del link para traer un link en especifico, es decir que si le pasamos el nanoLink del link valido nos tendria que traer la url que estamos buscando.


        //validamos si el link existe.
        if (!link) return res.status(404).json({ error: "No existe el link" })

        // if (!link.uid.equals(req.uid)) return res.status(404).json({ error: "No le pertenece ese link" })

        return res.redirect(link.longLink);

    } catch (error) {

        console.log(error)

        return res.status(500).json({ error: "Error del servidor" })
    }

}
