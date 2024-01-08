//con este middleware vamos a evaluar si el token es valido o no.
import jwt from "jsonwebtoken"
import { errorTokens } from "../utils/errorTokens.js";

//lo dejamos como respaldo el obtener el token desde el header.
export const requireToken = (req, res, next) => {

    try {
        //hacemos una console del req.headers que es el encabezado que va a contener la propiedad authorization que a su vez contiene el token de seguridad.
        // console.log(req.headers)//leemos el token


        let token = req.headers?.authorization;//vamos a obtener o leer el token que va a provenir del header en el objeto authorization. Ponemos el signo de pregunta por si la authorization no existe va hacer undefined.


        //vamos hace una condicion de que si no existe el token le mandamos un mensaje de error. si entra a este if nunca a llegar al next por lo tanto no va a seguir con el siguiente metodo de la ruta.
        if (!token) throw new Error("No existe el token en el header, utiliza formato Bearer")


        //Tenemos que estar reemplazando el formato en el que se queda el token.
        token = token.split(" ")[1];//vamos a separa el token mediante split que nos permite dividir o separar un string en un array, donde tenemos que indicarle un separador que va hacer un espacio " ", y tambien le tenemos que pasar el indice de nuestro string que va hacer [1] ya que el [0] es del Bearer


        //vamos a verificar el token con "verify" de jwt, donde recibe el token y la palabra secret
        const { uid } = jwt.verify(token, process.env.JWT_SECRET)// Esto nos va a devolver la informaciond decodificada, es decir, el payload que contiene los datos del usuario que no son delicado que utilizamos para firma el token, que fue el {uid} del user. por lo tanto hacemos un destructuracion de esa info.

        // console.log(payload)// si el token no es verificado va a saltar al cath "diciendo que el jwt esta mal formado", de lo contrario visualizariamos el uid del user.

        //le vamos a colocar una propiedad al "req" y le vamos asignar el uid que le pasamos al token.
        req.uid = uid; // osea que cualquier controlador o ruta que use este middleware va a tener acceso al req.uid, obviamente si el token es valido.

        next();

    } catch (error) {

        console.log(error);
        return res.status(401).json({ error: errorTokens(error.message) }) // le pasasmos el metodo que contiene el switch con los errores del token.

    }

}

//modificamos el este metodo para obtener el token que guardamos en la cookie.
// export const requireToken = (req, res, next) => {

//     try {


//         let token = req.cookies.cookieToken//vamos a obtener o leer las cookies y le mandamos el nombre de la cookie que creamos que era la del token


//         //vamos hace una condicion de que si no existe el token le mandamos un mensaje de error. si entra a este if nunca a llegar al next por lo tanto no va a seguir con el siguiente metodo de la ruta.
//         if (!token) throw new Error("No existe el token en el header, utiliza formato Bearer")


//         //vamos a verificar el token con "verify" de jwt, donde recibe el token y la palabra secret
//         const { uid } = jwt.verify(token, process.env.JWT_SECRET)// Esto nos va a devolver la informaciond decodificada, es decir, el payload que contiene los datos del usuario que no son delicado que utilizamos para firma el token, que fue el {uid} del user. por lo tanto hacemos un destructuracion de esa info.

//         // console.log(payload)// si el token no es verificado va a saltar al cath "diciendo que el jwt esta mal formado", de lo contrario visualizariamos el uid del user.

//         //le vamos a colocar una propiedad al "req" y le vamos asignar el uid que le pasamos al token.
//         req.uid = uid; // osea que cualquier controlador o ruta que use este middleware va a tener acceso al req.uid, obviamente si el token es valido.

//         next();

//     } catch (error) {

//         console.log(error);
//         return res.status(401).json({ error: errorTokens(error.message) }) // le pasasmos el metodo que contiene el switch con los errores del token.

//     }

// }