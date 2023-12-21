import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new Schema({

    email: {

        type: String,
        required: true,
        trim: true, // colocamos trim para limpiar los campos 
        unique: true,
        lowercase: true,// colocamos lowercase para sacar todas las mayusculas y guardar en minisculas
        index: { unique: true }// y indexamos los campos para hacer las busquedas muchos mas rapido

    },

    password: {

        type: String,
        required: true

    }

})


export const User = model("User", userSchema); // exportamos el modelo del esquema.
