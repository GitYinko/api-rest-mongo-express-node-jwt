//aqui vamos a gestionar los errores del token

export const errorTokens = (message) => {

    switch (message) {
        case "jwt malformed":
            return "Formato no válido";

        case "invalid token":
            return "Token invalido";

        case "jwt expired":
            return "Jwt expirado";

        case "invalid signature":
            return "La firma del jwt no es valida";

        default:

            return message
    }

}
