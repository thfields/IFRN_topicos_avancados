import bcrypt from 'bcrypt';
import Conta from '../models/contaModel.js';


async function verificarSenhaConta(req, res, next) {
    const { numero, senha } = req.body;

    // Encontrar a conta
    const conta = await Conta.findOne({ numero });
    if (!conta) {
        return res.status(404).json({ error: 'Conta não encontrada' });
    }

    // Comparar a senha fornecida com a senha no banco
    const senhaCorreta = await bcrypt.compare(senha, conta.senha);
    if (!senhaCorreta) {
        return res.status(400).json({ error: 'Senha incorreta' });
    }

    // Se a senha estiver correta, prossegue para a operação
    next();
}

export default verificarSenhaConta;
