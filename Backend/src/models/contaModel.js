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
    tipo: {
        type: String,
        enum: ['Comum', 'Bonus', 'Poupanca'],
        default: 'Comum'
    },
    pontuacao: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

export default mongoose.model('Conta', contaSchema);
