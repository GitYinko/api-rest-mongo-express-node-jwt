// Este es un modelo para las URLS

//IMPORTACIONES
import { Schema, model } from "mongoose"


//este esquema tiene que hacer referencia al usuario, por que cada vez que se cree una link o url tenemos que decirle que usuario lo hizo. Esto para separa urls por usuario.
const linkSchema = new Schema({

    longLink: { // ESTO SERIA LA URL ORIGINAL
        type: String,
        required: true,
        trim: true
    },

    nanoLink: { //ESTA ES LA URL CORTA
        type: String,
        unique: true,
        required: true,
        trim: true
    },

    uid: { // HACEMOS REFERENCIA AL MODELO USER
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

})

export const Link = model("Link", linkSchema);