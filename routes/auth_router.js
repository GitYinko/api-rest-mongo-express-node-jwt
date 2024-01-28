//Aqui vamos a crear las rutas de autenticacion.

// IMPORTACIONES
import { Router } from "express";
import { infoUser, logOut, login, refreshToken, register } from "../controllers/auth_controller.js";
import { requireToken } from "../middlewares/validationToken.js";
import { requireRefreshToken } from "../middlewares/validationRefreshToken.js";
import { loginValidator, registerValidator } from "../middlewares/validatorManager.js";



const router = Router() // este es un middleware de express para poder gentionar de mejor manera las rutas.


//vamos hacer solisitudes en verbo "post" para el login y register.
//como el navegador no toma este verbo y solo lo hace en get, vamos a usar el programa "posman" para simular el envio y ver si funciona el metodo de la ruta.
router.post("/register", registerValidator, register);

router.post("/login", loginValidator, login)



//vamos a crear una ruta de ejemplo para hacer la verificaion del token y proteger la ruta mediante un middleware que va a interseptar la ruta antes del controlador para preguntar sobre el token(solo ejemplo)
router.get("/protected", requireToken, infoUser)

//vamos a crear esta ruta para validar el refresh token y ejecutar el controlador que genera el token que nos va a permitir hacer las solicitudes.
router.get("/refresh", requireRefreshToken, refreshToken)

//ruta para cerrar session
router.get("/logout", logOut)




export default router;