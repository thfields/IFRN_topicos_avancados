import bcrypt from 'bcryptjs';
import Conta from '../models/contaModel.js';

async function verificarSenhaConta(req, res, next) {
    const { senha } = req.body; // Agora apenas busca a senha no body
    const { numero } = req.params; // Pega o número da conta do parâmetro da URL

    // Encontrar a conta
    const conta = await Conta.findOne({ numero: parseInt(numero, 10) });
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
