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


    async createConta(numero, senha, id, saldoInicial,tipo = 'Comum') {
        if (!numero || !senha || saldoInicial===0) {
            throw new Error('Número, senha e saldo inicial são obrigatórios');

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
            user: id,
            tipo: tipo,
            pontuacao: tipo === 'Bonus' ? 10 : 0
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
        if (valor <= 0) {
            throw new Error('Valor inválido para crédito');
        }

        const conta = await Conta.findOne({ numero: parseInt(numero, 10) });
        if (!conta) {
            throw new Error('Conta não encontrada');
        }

        conta.saldo += valor;

        if (conta.tipo === "Bonus") {
            // Inicializa pontuacao como 0 se for undefined ou null
            if (!conta.pontuacao || isNaN(conta.pontuacao)) {
                conta.pontuacao = 0;
            }
            conta.pontuacao += Math.floor(valor / 100); // Regra: 1 ponto para cada R$100
        }

        await conta.save();
        return conta;
    }

    async debitConta(numero, valor) {
        if (isNaN(valor) || valor <= 0) {
            throw new Error('Valor inválido para débito');
        }

        const conta = await Conta.findOne({ numero: parseInt(numero, 10) });
        if (!conta) {
            throw new Error('Conta não encontrada');
        }

        if (conta.saldo < valor) {
            throw new Error('Saldo insuficiente');
        }

        conta.saldo -= valor;
        await conta.save();
        return conta;
    }

    async transfer(numero, paraConta, valor) {
        if (isNaN(valor) || valor <= 0) {
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
    
        if (fromConta.saldo < valor) {
            throw new Error('Saldo insuficiente na conta de origem');
        }
    
        fromConta.saldo -= valor;
        toConta.saldo += valor;

        if (toConta.tipo === 'Bonus') {
            toConta.pontuacao += Math.floor(valor / 200); // Regra: 1 ponto para cada R$200
        }
    
        await fromConta.save();
        await toConta.save();
    
        return { fromConta, toConta };
    }

    async renderJuros(numero, taxa) {
        if (isNaN(taxa) || taxa <= 0) {
            throw new Error('Taxa de juros inválida');
        }

        const conta = await Conta.findOne({ numero: parseInt(numero, 10) });
        if (!conta) {
            throw new Error('Conta não encontrada');
        }

        if (conta.tipo !== "Poupanca") {
            throw new Error('Operação permitida apenas para contas do tipo Poupança');
        }

        const juros = conta.saldo * (taxa / 100);
        conta.saldo += juros;

        await conta.save();
        return conta;
    }
    
}

export default new ContaService();