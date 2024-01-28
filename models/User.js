import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new Schema({

    email: {

        type: String,//como tenemos de tipo string el objeto email, mongoose solo va a esperar ese string por lo tanto si mandan un objeto malicioso { $ne: 1} como consulta no lo tomaria ya que espera ese string( esto segun mongoose sanitize).
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

userSchema.pre("save", async function (next) { //usamos metodo del schema "pre" para interceptar el guardado y poder hacer un hash a la contraseña.

    const user = this; //este this  va hacer referenncia a las propiedades del esquema.

    //en le caso que el usuario queiera modificar algo hacemos esta condicion para no volver a hashiar la contraseña, es decir, que no nos vuela a modificar las password con el hash. 
    if (!user.isModified("password")) return next(); // estamos diciendo que si no se modifica a la ccontraseña seguimos con el sigunete metodo y no hasheamos la contraseña nuevamente.

    try {

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(user.password, salt) //asingamos a la propiedad password del usar la contraseña hashiada.

        next();

    } catch (error) {

        console.log(error)
        throw new Error("falló el hash de la contraseña")

    }

})


//vamos hacer un metodo para comparar la contraseña que manda el usuario con la que tenemos en la BD. para ello vamos a usar los metodos de el esquema
userSchema.methods.comparePassword = async function (candidatePassword) { //hacemos una funtion tradicional para poder acceder al this.

    return await bcrypt.compare(candidatePassword, this.password) // usamos bcrypt para compara las contraseñas y va de volver un booleano.

}



export const User = model("User", userSchema); // exportamos el modelo del esquema.
