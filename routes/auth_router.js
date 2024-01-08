//Aqui vamos a crear las rutas de autenticacion.

// IMPORTACIONES
import { Router } from "express";
import { body } from "express-validator" //con el metodo body vamos a poder acceder a las propiedades que estamos leyendo.
import { infoUser, logOut, login, refreshToken, register } from "../controllers/auth_controller.js";
import { validationResultExpress } from "../middlewares/validationResultExpress.js"; // middleware que creamos para validar los resutados de nuestro validaciones express.
import { requireToken } from "../middlewares/validationToken.js";
import { requireRefreshToken } from "../middlewares/validationRefreshToken.js";



const router = Router() // este es un middleware de express para poder gentionar de mejor manera las rutas.


//vamos hacer solisitudes en verbo "post" para el login y register.
//como el navegador no toma este verbo y solo lo hace en get, vamos a usar el programa "posman" para similar el envio y ver si funciona el metodo de la ruta.
router.post("/register", [//vamos hacer validaciones antes de activar el controlador de autenticacion, donde le vamos a pasar un array para usar todos los middleware de validaciones que nos provee express validate

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

        })


], validationResultExpress, register);

router.post("/login", [

    body("email", "Ingrese un Email valido")
        .trim()
        .isEmail()
        .normalizeEmail(),

    body("password", "Contraseña incorrecta")
        .trim()
        .isLength({ min: 6 })
        .escape()


], validationResultExpress, login)



//vamos a crear una ruta de ejemplo para hacer la verificaion del token y proteger la ruta mediante un middleware que va a interseptar la ruta antes del controlador para preguntar sobre el token(solo ejemplo)
router.get("/protected", requireToken, infoUser)

//vamos a crear esta ruta para validar el refresh token y ejecutar el controlador que genera el token que nos va a permitir hacer las solicitudes.
router.get("/refresh", requireRefreshToken, refreshToken)

//ruta para cerrar session
router.get("/logout", logOut)




export default router;