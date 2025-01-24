import Conta from '../models/contaModel.js';
import bcrypt from 'bcrypt';

class ContaService {
    async getContasByUser(id) {
        const contas = await Conta.find({ user: id });
        if (!contas || contas.length === 0) {
            throw new Error('Nenhuma conta encontrada para este usuário');
        }
        return contas;
    }

    async createConta(numero, senha, id) {
        if (!numero || !senha) {
            throw new Error('Número e senha são obrigatórios');
        }

        const existingConta = await Conta.findOne({ numero });
        if (existingConta) {
            throw new Error('Número de conta já existe');
        }

        const hashedPassword = await bcrypt.hash(senha, 10);
        const newConta = await Conta.create({
            numero: parseInt(numero, 10),
            saldo: 0,
            senha: hashedPassword,
            user: id
        });

        return newConta;
    }

    async getSaldo(numero) {
        const conta = await Conta.findOne({ numero: parseInt(numero, 10) });
        if (!conta) {
            throw new Error('Conta não encontrada');
        }
        return conta.saldo;
    }

    async creditConta(numero, valor) {
        if (isNaN(valor) || valor <= 0) {
            throw new Error('Valor inválido para crédito');
        }

        const conta = await Conta.findOne({ numero: parseInt(numero, 10) });
        if (!conta) {
            throw new Error('Conta não encontrada');
        }

        conta.saldo += valor;
        await conta.save();
        return conta;
    }

    async debitConta(numero, valor) {
        if (isNaN(valor) || valor <= 0) { // correcao de bug ficticio (já verifcava antes)
            throw new Error('Valor inválido para débito');
        }

        const conta = await Conta.findOne({ numero: parseInt(numero, 10) });
        if (!conta) {
            throw new Error('Conta não encontrada');
        }

        if (conta.saldo < valor) { // correcao de bug ficticio (já verifcava antes)
            throw new Error('Saldo insuficiente');
        }

        conta.saldo -= valor;
        await conta.save();
        return conta;
    }

    async transfer(numero, paraConta, valor) {
        if (isNaN(valor) || valor <= 0) { // correcao de bug ficticio (já verifcava antes)
            throw new Error('Valor inválido para transferência');
        }
    
        const fromConta = await Conta.findOne({ numero: parseInt(numero, 10) });
        const toConta = await Conta.findOne({ numero: parseInt(paraConta, 10) });
    
        if (!fromConta) {
            throw new Error('Conta de origem não encontrada');
        }
        if (!toConta) {
            throw new Error('Conta de destino não encontrada');
        }
    
        if (fromConta.saldo < valor) { // correcao de bug ficticio (já verifcava antes)
            throw new Error('Saldo insuficiente na conta de origem');
        }
    
        fromConta.saldo -= valor;
        toConta.saldo += valor;
    
        await fromConta.save();
        await toConta.save();
    
        return { fromConta, toConta };
    }
    
}

export default new ContaService();
