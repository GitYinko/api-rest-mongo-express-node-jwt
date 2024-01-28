//este archivo va a hacer interpretado por el navegador por lo tanto vamos a tener acceso al DOM y al metodo FETCH.

const form = document.getElementById("form");
const email = document.getElementById("email");
const password = document.getElementById("password");

form.addEventListener("submit", async (e) => {

    e.preventDefault()

    try {

        //ahora vamos a hacer nuestra solicitud a la DB con el metodo fetch(), solo podemos usar este metodo cuando el archivo js es interpretado por el navegador
        // va hacer la solicitud a nuestro login que esta en la ruta "/api/v1/auth/login"
        // por defecto el fetch hace una solicitud en get
        const res = await fetch("http://localhost:5000/api/v1/auth/login", {
            //aqui vamos hacer la configuracion de la solicitud que le vamos hacer al Backend osea nuestra DB.
            method: "POST", // tipo de metodo
            headers: { // establecemos el encabezado, diciendo que el intercabio de info va hacer en Json.

                "Content-Type": "application/json",

            },
            body: JSON.stringify(
                {
                    email: email.value,
                    password: password.value
                }), // le decimos al body que es donde recibimos la informacion que con "JSON.stringify()" que nos convierte un valor de js a un objeto. va a recibir los valore de email y password y los va a transformar en objetos.

        })

        console.log(res.ok, res.status); // son la respuestas mas importantes.

        //ahora vamos a leer esa respuesta "res" en json. por que nosotros configuramos la respuesta del login con el token y expiresIn en json.
        const data = await res.json();

        // const { token } = data;

        //hacemos la prueba de almacenar el token en el localStorage para la persisten del mismo (Priemra opcion NO SEGURA).
        // localStorage.setItem("token", token);

        console.log(data);

    } catch (error) {

        console.log(error)

    }

})