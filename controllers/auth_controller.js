//Aqui van a estar los controladores de las rutas auth

//IMPORTACIONES


export const register = (req, res) => {

    console.log(req.body); // el req va a contener las peticiones o los requerimientos del usuario y el body es donde se guardan esas petisiones.
    res.json({ ok: "register" })

}

export const login = (req, res) => {

    res.json({ ok: "login" })

}
