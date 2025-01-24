import mongoose from "mongoose";
import AutoIncrementFactory from 'mongoose-sequence';

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    createData: {
        type: Date,
        default: Date.now()
    }
   
});

export default mongoose.model("User", userSchema);