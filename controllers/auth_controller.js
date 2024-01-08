//Aqui van a estar los controladores de las rutas auth

//IMPORTACIONES
import { User } from "../models/User.js";
import { generateRefreshToken, generateToken } from "../utils/tokenManager.js";


export const register = async (req, res) => {

    // console.log(req.body); // el req va a contener las peticiones o los requerimientos del usuario y el body es donde se guardan esas petisiones.

    //vamos a guardar al usuario
    try {

        const { email, password } = req.body;

        //Buscamos una propiedad del esquema que va hacer el email donde vamos a evaluar si existe o no en nuestra DB. Consultamos a la BD
        let userRegister = await User.findOne({ email });

        //vamos a mandar un mensaje de error si se repite el email segun los codigos de error de la DB.
        //status 400 es de solisitud incorrecta
        if (userRegister) return res.status(400).json({ error: "Email ya registrado" });


        //le instanciamos un nuevo usuario al esquema
        userRegister = new User({ email, password });

        await userRegister.save();


        //status 201 es de solisitud creada.
        return res.status(201).json({ ok: "register" })


    } catch (error) {

        console.log(error)

        //estatus 500 son de errores del servidor. Los status 300 son de redirezionamiento.
        return res.status(500).json({ error: "Problemas de servidor" });


    }


}

export const login = async (req, res) => {


    try {

        const { email, password } = req.body;

        let userLogin = await User.findOne({ email })// busacamos por correo electronico para ver si el usuario existe.

        //si le usuario email no existe o la password que se compara no coinciden va a entrar a este if y me va tirar un mensaje de error
        if (!userLogin || !(await userLogin.comparePassword(password))) {

            return res.status(400).json({ error: "Email o contraseña es incorrecta" });

        }

        //llamamos a la utilidad para generar el token.
        const { token, expiresIn } = generateToken(userLogin._id);

        //llamamos a la utilidad para generar el refresh token.
        generateRefreshToken(userLogin._id, res); //a direnferencia del generateToken este resibe dos param que es el uid y el res de este metodo por que si no funcionaria ya que estamos usando el res para crear la cookie.

        //EJEMPLO DE PERSISTENCIA CON COOKIE.
        // //vamos a generar una cookie para hacer la persistencia del token (solo por practica ya que no es totalmente seguro, pero si mas que el metodo del localStorage).
        // res.cookie("cookieToken", token, {

        //     httpOnly: true, // esto quiere decir que el token solo va a vivir en el servidor y no pueda ser accedido desde el navegador mediante la consola en javascript. Marca la cookie para que solo el servidor web pueda acceder a ella.

        //     secure: !(process.env.MODO === "developer"), //Marca la cookie para que se utilice únicamente con HTTPS. Pero como nosotros cuando estamos en modo desarrollo estamos trabajando con http por lo tanto no funcionaria. Pero nosotro creamos una variable de entorno que nos indica en que modo esta nuesta app, si desarrollo o produccion. En esta logica "!(process.env.MODO === "developer")" estamos diciendo que si el contenido de los parentesis es igual a "developer" es falso ya que para ser true espera que se lo contrario, es decir , que no este en modo desarrollo

        // })// este metodo recibe el nombre de la cookie y el valor que queremos almacenar en la misma que va hacer nuestro token y ademas como tercer parametro tenemos algunas configuraciones para mejorar la seguridad.


        return res.json({ token, expiresIn });

    } catch (error) {

        console.log(error)
        return res.status(500).json({ error: "Problemas de servidor" });

    }

}


//vamos hacer este contralador solo de ejemplo.
export const infoUser = async (req, res) => {

    try {

        const user = await User.findById(req.uid).lean()//este uid viene del middleware validationToken en el que le asignamos al req.uid el uid del token que viene del payload. que nos va a servir para buscar por id de usuario para devolver la informacion. podemos devolver un objeto simple de js con lean siendo mas rapido, por que si no nos trae un objeto con mongoose para que tenga todos los metodos disponible.

        //Vamos a usar el token para hacer peticiones y que esta ↓↓ informacion vaya a una ruta pretegida
        return res.json({ email: user.email, uid: user._id })

    } catch (error) {

        return res.status(500).json({ error: "error de servidor" });

    }

}


//creamos el  metodo que va a obtener el token que nos va a permitir hacer las peticiones, cuando pasa las validaciones del reffresh token.
export const refreshToken = (req, res) => { // ADVERTENCIA: ES OBLIGATORIO QUE LOS PARAMETROS DE LOS CONTROLADORES Y MIDDLEWARE SEAN EN ESTE ORDEN (req, res, next) POR QUE NO VA A FUNCIONAR.
    try {

        const { token, expiresIn } = generateToken(req.uid)//como tenemos el id del user gracias al middleware del refresh token, generamos un nuevo token de segurida y ese token lo devolvemos a la vista como petision.

        return res.json({ token, expiresIn });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "error de server" });
    }
}

//creamos metodo poara cerrar session, esto va a destruir la cookie, es decir, que cuando se cierre session va a eliminar el contenido de la cookie que es el refresh token.
export const logOut = (req, res) => {

    //mandamos un res con el metodo clearCookie() que recibe como param el nombre de la cookie.
    res.clearCookie("tokenRefresh")

    return res.json({ ok: true });

}


