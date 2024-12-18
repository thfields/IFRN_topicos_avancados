import Conta from '../models/contaModel.js';
import bcrypt from 'bcrypt';

class ContaService {
    async createConta(numero, senha, userId) {
        const existingConta = await Conta.findOne({ numero });
        if (existingConta) {
            throw new Error('Número de conta já existe');
        }

        // Criptografar a senha antes de salvar
        const hashedPassword = await bcrypt.hash(senha, 10);

        // Criar a conta e associá-la ao usuário
        const newConta = await Conta.create({
            numero,
            saldo: 0,
            senha: hashedPassword,
            user: userId // Associa a conta ao usuário
        });

        return newConta;
    }

    async getSaldo(numero) {
        const conta = await Conta.findOne({ numero });
        if (!conta) {
            throw new Error('Conta não encontrada');
        }
        return conta.saldo;
    }

    async creditConta(numero, valor) {
        const conta = await Conta.findOne({ numero });
        if (!conta) {
            throw new Error('Conta não encontrada');
        }

        conta.saldo += valor;
        await conta.save();
        return conta;
    }

    async debitConta(numero, valor) {
        const conta = await Conta.findOne({ numero });
        if (!conta) {
            throw new Error('Conta não encontrada');
        }

        conta.saldo -= valor;
        await conta.save();
        return conta;
    }

    async transfer(fromNumero, toNumero, valor) {
        const fromConta = await Conta.findOne({ numero: fromNumero });
        const toConta = await Conta.findOne({ numero: toNumero });

        if (!fromConta) {
            throw new Error('Conta de origem não encontrada');
        }
        if (!toConta) {
            throw new Error('Conta de destino não encontrada');
        }

        fromConta.saldo -= valor;
        toConta.saldo += valor;

        await fromConta.save();
        await toConta.save();

        return { fromConta, toConta };
    }
}

export default new ContaService();
