//IMPORTACIONES
import { validationResult } from "express-validator" // vamos a capturar los errores de las validaciones, es decir, obtener los resutados de esas validaciones.


export const validationResultExpress = (req, res, next) => {

    //vamos a preguntar los errores de nuestras validaciones
    const errors = validationResult(req);// recibe el reques por de ahi viene lo que esta intersectando lo que ingresa el usuario.

    if (!errors.isEmpty()) {// preguntamos si esto esta vacio, en caso de que no este vacio le mandamos los errores.
        return res.status(400).json({ error: errors.array() });
    }

    next();

}


//MIDDLEWARE PARA OBTENER LOS RESULTADOS DE LAS VALIDACIONES DE EXPRESS.