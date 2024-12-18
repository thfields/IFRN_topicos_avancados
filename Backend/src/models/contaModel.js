import mongoose from 'mongoose';

const contaSchema = new mongoose.Schema({
    numero: {
        type: Number,
        required: true,
        unique: true
    },
    saldo: {
        type: Number,
        default: 0
    },
    senha: {
        type: String,
        required: true
    },
    // Referência ao usuário
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Refere-se ao modelo User
        required: true
    }
});

export default mongoose.model('Conta', contaSchema);
