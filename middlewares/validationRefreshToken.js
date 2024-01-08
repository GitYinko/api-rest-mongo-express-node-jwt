// creamos este middleware para leer la cookie y validar el refresh token

import jwt from "jsonwebtoken"
import { errorTokens } from "../utils/errorTokens.js";


export const requireRefreshToken = (req, res, next) => {

    try {

        let refreshTokenCookie = req.cookies?.tokenRefresh;//vamos a obtener o leer el token que va a provenir de la cookie.


        //vamos hace una condicion de que si no existe el token le mandamos un mensaje de error. si entra a este if nunca a llegar al next por lo tanto no va a seguir con el siguiente metodo de la ruta.
        if (!refreshTokenCookie) throw new Error("No existe el token")


        //vamos a verificar el token con "verify" de jwt, donde recibe el token y la varible de entorno del refresh
        const { uid } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH)// Esto nos va a devolver la informaciond decodificada, es decir, el payload que contiene los datos del usuario que no son delicado que utilizamos para firma el token, que fue el {uid} del user. por lo tanto hacemos un destructuracion de esa info.

        // console.log(payload)// si el token no es verificado va a saltar al cath "diciendo que el jwt esta mal formado", de lo contrario visualizariamos el uid del user.

        //le vamos a colocar una propiedad al "req" y le vamos asignar el uid que le pasamos al token.
        req.uid = uid; // osea que cualquier controlador o ruta que use este middleware va a tener acceso al req.uid, obviamente si el token es valido.

        next();

    } catch (error) {

        console.log(error);
        return res.status(401).json({ error: errorTokens(error.message) })

    }

}
