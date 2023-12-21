//jsonwebtoken es un paquete que nos permites generer tokens de seguridad para elk frondend de alguna forma gestione ese token y lo puede enviar por cada solisitud y nostros sepamos que ese usuario este autenticado y esta autorizado para hacer unas solisitudes.

//CORS es un paquete que nos permite configurar que servidor que va hacer nuestro backend y otro servidor que va hacer nuestro fronend se puedan comunicar correctamente

//cookie-parser este paquete nos sirve para trabajar con jsonwebtoken para guarada el refresh token en una cookie segura que no va hacer accesible dentro del fronend

//para trabajar con copn los modulos import hay que poner en el archivo package.json de type module.


//IMPORTACIONES
import "dotenv/config"; // si lo llamamos del archivo raiz los demas archivos van a poder tener acceso a las variables de entorno cuando se ejecute este archivo.
import "./database/connectdb.js" //importamos la base de datos. y node siempre tenemos que poner la extension del archivo diferente es con los framework que no es necesario.
import express from "express"
import authRouter from "./routes/auth_router.js"



//inicializamos el servidor
const app = express();

const PORT = process.env.PORT || 5000; //la variable de entorno PORT no la va a generar el proveedor de nuestro deploy.

app.listen(PORT, () => console.log("Servidor funcionando 🚀 desde: http://localhost:" + PORT));



//MIDDLEWARE

// middleware para habilitarle a express leer las solisitudes en json, tiene que estar arriba de las rutas, ya que tiene que recibir esos requerimientos primero.
app.use(express.json());

// middleware para llamar las rutas de auntenticacion. Que van a tener como ruta raiz "/api/v1" en el que especificamos la version de la app.
app.use("/api/v1", authRouter);