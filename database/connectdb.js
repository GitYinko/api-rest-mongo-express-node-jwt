import mongoose from "mongoose";


try {

    await mongoose.connect(process.env.URL_MONGO); // como estamos trabajando con node.js podemos llamar a un await sin necesidad de encerrarlo en un async.
    console.log("db conectada 😁");
    
} catch (error) {
 
    console.log("😒" + error)

}

