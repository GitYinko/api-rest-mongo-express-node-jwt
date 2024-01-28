//Middleware de validaciones para las rutas de autenticacion.

import { body, cookie, header, param } from "express-validator" //con el metodo body vamos a poder acceder a las propiedades que estamos leyendo.
import { validationResultExpress } from "../middlewares/validationResultExpress.js"; // middleware que creamos para obtener los resutados de nuestro validaciones express.
import axios from "axios";

export const registerValidator = [ //vamos hacer validaciones antes de activar el controlador de autenticacion, donde le vamos a pasar un array para usar todos los middleware de validaciones que nos provee express validate

    body("email", "Ingrese un Email valido")
        .trim()
        .isEmail()
        .normalizeEmail(),

    body("password", "Minimo 6 carateres")
        .trim()
        .isLength({ min: 6 })
        .escape()
        .notEmpty(),

    body("password", "formato password incorrecto")
        .custom((value, { req }) => { // esta validacion personalizada toma un value que es el password y un reques que es todo los requerimientos de usuario

            if (value !== req.body.repassword) { throw new Error("Las contraseñas no coinciden") }

            return value;

        }),

    validationResultExpress // tambien le pasamos el metodo para obtener los resultados de las validaciones de express. sin este metodo no estariamos  enteredos de cual validacion no esta siendo cumplida.
];


export const loginValidator = [

    body("email", "Ingrese un Email valido")
        .trim()
        .isEmail()
        .normalizeEmail(),

    body("password", "Contraseña incorrecta")
        .trim()
        .isLength({ min: 6 })
        .escape(),

    validationResultExpress

];

export const linkValidator = [
    body("longLink", "Formato link incorrecto")

        .trim()
        .notEmpty()
        .custom(async (value) => { // lo hacemos async por que vamos hacer la solicitud con axios

            try { // es importante hacer el trycatch cuando usamos axios por que si falla va a saltar al catch


                //ESTA CONDICION ES POR SI EL USUARIO NO MANDA LA URL EN FORMATO HTTPS
                //vamos a decirle que solo acepte urls seguras con el formato https://
                if (!value.startsWith("https://")) { // en esta condicion estamos dicien que si el comienzo de la url no es "https" entra al if para concatenar al value el https. startsWith nos permite detectar el comienzo de un string.
                    value = "https://" + value;

                }

                await axios.get(value) //esperamos el link

                return value

            } catch (error) {

                console.log(error)
                throw new Error("Not found link 404")

            }

        }),
    validationResultExpress


];

export const paramNanoLinkValidator = [
    param("nanoLink", "Formato no valido (Express validator)")
        .trim()
        .notEmpty()
        .escape(),

    validationResultExpress
];

export const tokenHeaderValidator = [

    header("authorization", "No existe el token") //accedemos al header donde se ecuentra nuestro token
        .trim()
        .notEmpty() // no tiene que estar vacio
        .escape(), //para caracteres especiales
    validationResultExpress

];

export const tokenCookieValidator = [

    cookie("tokenRefresh", "No existe refresh token")
        .trim()
        .notEmpty()
        .escape(),

    validationResultExpress

];
