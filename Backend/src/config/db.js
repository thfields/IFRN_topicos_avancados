import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function dbConnect() {
    try {
        await mongoose.connect(process.env.URL_DATABASE, {
            serverSelectionTimeoutMS: 30000, // 30 segundos
            socketTimeoutMS: 30000, // 30 segundos
        });
        console.log("Autenticação com o MongoDB realizada com sucesso!");
    } catch (error) {
        console.error("Erro na autenticação do MongoDB.", error);
    }
}

export default dbConnect;