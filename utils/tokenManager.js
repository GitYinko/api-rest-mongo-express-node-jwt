//creamos una utilidad para generar un token de seguridad para llamar a diferentes accesos que le demos al usuario.

import jwt from "jsonwebtoken";

//GENERAMOS EL TOKEN QUE VALIDA LAS PETISIONES.
export const generateToken = (uid) => {

    //vamos a gestionar una fecha de expiración
    const expiresIn = 60 * 15; // esto van hacer 15min que a durar el token. Esta constante tiene que ser nombrada como la propiedad expiresIn.

    try {

        //generamos el token con jwt. El metodo (sing: firma nuestro token), resibe como parametro el payload que son datos no delicados del usuario,vamos a usar el id generado por mongo; tambien resibe como segundo parametro el secret que es una clave secreta que solo nostros debemos saber y como tercer param la fecha de expiracion.
        const token = jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn });

        return { token, expiresIn } // para despues del lado del front ver cuanto tiempo le queda al token y hacer la revalidacion del token cuando expire.


    } catch (error) {

        console.log(error);

    }
}

//GENERAMOS OTRO TOKEN PERO QUE VA HACER NUESTRO REFRESH TOKEN
export const generateRefreshToken = (uid, res) => {

    //la funcion de este token es para manadar una solisitud al servidor y el servidor va a ver si este token es valido, si lo es, nos va a devolver el token verdadero que seria el generado en el metodo anterior que nos va a permitor hacer las peticiones a las rutas que hagan consultas a la DB.

    //Hacemos la expiracion del token, como es un token de refresh puede durar mas 
    const expiresIn = 60 * 60 * 24 * 30;// esto quiere decir que dura 30 dias.

    try {

        //generamos el refreshToken con jwt. El metodo (sing: firma nuestro token), resibe como parametro el payload que son datos no delicados del usuario,vamos a usar el id generado por mongo; tambien resibe como segundo parametro el secret que es una clave secreta que solo nostros debemos saber y como tercer param la fecha de expiracion.
        const refreshToken = jwt.sign({ uid }, process.env.JWT_REFRESH, { expiresIn });

        //Vamos a guardar este refresh token en una cookie, ya que es un refresh token, daria lo mismo si lo roban por que este token no es el que valida las petisiones si no para ir refrescando o generenado otro token.
        res.cookie("tokenRefresh", refreshToken, {// este metodo recibe el nombre de la cookie y el valor que queremos almacenar en la misma que va hacer nuestro refresh token y ademas como tercer parametro tenemos algunas configuraciones para mejorar la seguridad.

            httpOnly: true, // esto quiere decir que el token solo va a vivir en el servidor y no pueda ser accedido desde el navegador mediante la consola en javascript. Marca la cookie para que solo el servidor web pueda acceder a ella.

            secure: !(process.env.MODO === "developer"), //Marca la cookie para que se utilice únicamente con HTTPS. Pero como nosotros cuando estamos en modo desarrollo estamos trabajando con http por lo tanto no funcionaria. Pero nosotro creamos una variable de entorno que nos indica en que modo esta nuesta app, si desarrollo o produccion. En esta logica "!(process.env.MODO === "developer")" estamos diciendo que si el contenido de los parentesis es igual a "developer" es falso ya que para ser true espera que se lo contrario, es decir , que no este en modo desarrollo.

            expires: new Date(Date.now() + expiresIn * 1000) //le mandamos una fecha en especifico de cuando va a cadudcar el refresh token. Hay que multiplicarlo por 1000 ya que el metodo date.now es ta en milisegundos.

        });

        // este metodo no necesita retornar nada por qu lo estasmo guardando en la cookie.

    } catch (error) {
        console.log(error);
    }

}


