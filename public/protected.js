const logOut = document.getElementById("logOut")

logOut.addEventListener("click", async (e) => {
    e.preventDefault()

    const resLogOut = await fetch("/api/v1/auth/logout", {

        method: "GET",


    });

    console.log(resLogOut);

})


document.addEventListener("DOMContentLoaded", async (e) => {
    e.preventDefault()

    const userInfo = document.getElementById("userInfo");

    try {

        //Aqui hacemos la permanencia del token. Hay varias opciones en donde guardar el token para dicha permanencia son:
        //LocalStorage.
        //Cookie.
        //En memoria.
        //vamos a ir viendo una por una, pero vamos a utilizar al final el guardarla en memoria ya que es la mas segura.

        // Empezamos por localstorage donde vamos a llamar al mismo con la clave "token" que creamos en el fetch que obtiene la ruta del login, es decir, que cuando el login inicie sesion y cree ese token se va a guardar en el localstorage y traemos el token a este fetch para darle los permisos.
        // const token = localStorage.getItem("token")


        //hacemos la persistencia del token con la tercera opcion que es en memoria. Creamos otro metodo fetch en el que vamos a consultar la ruta de refresh token donde se encuentra el middleware donde valida si el refresh token es valido o no, en caso de si, ejecuta el controlador de esta ruta que va a crear un nuevo token que nos va a permitir hacer las peticiones.
        const resToken = await fetch("/api/v1/auth/refresh", { // ESTA RUTA ME VA A DEVOLVER EL TOKEN DE SEGURIDAD REAL SIEMPRE Y CUANDO EL REFRESH TOKEN SEA VALIDO.

            credentials: "include",// esto quiere decir que por cada solicitud que hagamos al servidor incluya las credenciales y va hacer la cookie que tiene le nombre de "refreshToken"

        });

        console.log(resToken.ok, resToken.status)

        const dataToken = await resToken.json();// decimos  que la respuesta del token sea en json

        const { token } = dataToken;//destructuramos la respues en la que esta retornando el token y la expiracion. usamos es variable para mandarla a la propiedad authorization del headers.



        const res = await fetch("/api/v1/auth/protected", {

            method: "GET",
            headers: {

                Authorization: `Bearer ${token}`, // comentamos esta autorizacion por que ya no la necesitamos ya que vamos a guardar el token en una cookie y no necesita de esto va a usar credenciales.

                'Content-Type': 'application/json',

            },

            //Hacemos la segunda opcion con cookie. ESTE METODO es seguro pero tiene un riesgo que es que la estamos incluyendo a la solisitud, ya que si entramos a una pagina malisiosa teniendo nuestra credenciales activas podemos correr el riesgo de que esa pagina pueda acceder a la misma y hacer solicitudes. 
            // //vamos a enviar la cookie en cada solicitud que hagamos con fetch sin nencesidad de enviarla desde js ya que no podemos acceder a ella desde js, pero le podemos decir al fetch que incluya la cookie
            // credentials: "include",// esto quiere decir que por cada solicitud que hagamos al servidor incluya las credenciales y va hacer la cookie que tiene le nombre de "token".

        });

        console.log(res.ok, res.status)

        const data = await res.json()

        if (!res.ok) {
            window.location.href = "/"
        }

        userInfo.innerHTML =
            `<h2>Email: ${data.email} </h2>
             <h3>UID: ${data.uid} </h3>`;

        // if (res.ok) {

        //     document.getElementById("email").textContent = "Email: " + data.email;

        // }

        console.log(data);

    } catch (error) {

        console.log(error)

    }

})