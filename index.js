//jsonwebtoken es un paquete que nos permites generer tokens de seguridad para elk frondend de alguna forma gestione ese token y lo puede enviar por cada solisitud y nostros sepamos que ese usuario este autenticado y esta autorizado para hacer unas solisitudes.

//CORS es un paquete que nos permite configurar que servidor va hacer nuestro backend y otro servidor que va hacer nuestro fronend y se puedan comunicar correctamente (es la comunicaion entre diferentes servidores. )

//cookie-parser este paquete nos sirve para trabajar con jsonwebtoken para guarada el refresh token en una cookie segura que no va hacer accesible dentro del fronend

//axios este paquete nos permite hacer de forma sencilla solicitudes http

//para trabajar con los modulos import hay que poner en el archivo package.json de type module.



//IMPORTACIONES
import "dotenv/config"; // si lo llamamos del archivo raiz los demas archivos van a poder tener acceso a las variables de entorno cuando se ejecute este archivo.
import "./database/connectdb.js" //importamos la base de datos. y node siempre tenemos que poner la extension del archivo diferente es con los framework que no es necesario.
import express from "express"
import authRouter from "./routes/auth_router.js" //importacion por defecto
import linkRouter from "./routes/link_router.js"
import redirectRouter from "./routes/redirect_router.js"
import cookieParser from "cookie-parser";//hacemos esta importacion par hacer la permanencian del token, guardando el token en una cookie(segunda opcion NO SEGURA).
import cors from "cors"



//inicializamos el servidor
const app = express();

const PORT = process.env.PORT || 5000; //la variable de entorno PORT no la va a generar el proveedor de nuestro deploy.

app.listen(PORT, () => console.log("Servidor funcionando 🚀 desde: http://localhost:" + PORT));



//MIDDLEWARE
//advertencia el middleware de las rutas siempre tiene que estar por debajo de los middleware con los metodos que se tienen que ejecutar antes de las rutas.



//middleware para la comunicaion entre servidores de forma segura con cors. 
// si dejamos solo esta lina de codigo asi "use.app(cors());" y no hacemos la configuracion de cors, estariamos deciendo que todos tiene acceso al backend (y no es correcto).

//vamos a crear una array con los dominias que queramos aceptar en nuestra app para que tengan acceso a nuestro servidor backend.
const whiteList = [process.env.ORIGIN1, process.env.ORIGIN2]

app.use(cors({//la forma correcta es pasando la configuracion al metodo.

    //esta propiedad va a tener una funcion donde va a obtener de donde se hace la solicitud, es decir, de que dominio se hace
    origin: function (origin, callback) { //El param "origin" es el que hace la solicitud y es el que vamos a compara con el de la array de dominos que le permitimos el acceso. (data: el origin es el dominio raiz por ejemplo "https://www.youtube.com", no es necesario agregar los sub dominios como "https://www.youtube.com/playlist?list").


        //validamos si el dominio del origin coincide con el dominio de nuestro array whiteList
        if (!origin || whiteList.includes(origin)) {//el metodo include busca en un array lo que se le pasa por param, va hacer true o false segun si existe o no.

            //si existe retornamos el callback, donde el mismo tiene dos argumento, en el primero se pasan los errores y en el segundo el valor positivo, como este callback esta dentro de este if no va a tener errores si entra, por lo tanto le pasamos null en el primer argumento ya que nunca va a tener errores por que el origin va a coincidir con nuestro array.
            return callback(null, origin);

        }

        //y caso que no entre al if es por que ese dominio no tiene acceso a nuestro servidor backend, por lo tanto aqui si retornamos el error del callback
        return callback("Dominio " + origin + " no autorizado por Cors");


    }

}));

//habilitamos este middleware para avisarle a express que vamos a usar cookies. 
app.use(cookieParser());

// middleware para habilitarle a express leer las solisitudes en json, tiene que estar arriba de las rutas, ya que tiene que recibir esos requerimientos primero.
app.use(express.json());

//hacemos este middleware para habilitar la carpeta public que va hacer expuesta, y va a estar en la ruta raiz "http://localhost:5000" (solo de ejemplo de login y token)
app.use(express.static("public"));

// middleware para llamar las rutas de auntenticacion. Que van a tener como ruta raiz "/api/v1/auth" en el que especificamos la version de la app.
app.use("/api/v1/auth", authRouter);

//middleware para llamar las rutas de link. Que van a tener los metodos CRUD.
app.use("/api/v1/links", linkRouter);

//middleware para llamar las rutas que va hacer el redireccionamiento.
app.use("/", redirectRouter);//Redirect del lado del back(opcional) solo ejemplo



