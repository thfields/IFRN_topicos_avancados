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

    async createConta(numero, senha, id, tipo = 'Comum') {
        if (!numero || !senha) {
            throw new Error('Número e senha são obrigatórios');
        }

        const existingConta = await Conta.findOne({ numero });
        if (existingConta) {
            throw new Error('Número de conta já existe');
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        // Verificar saldo inicial para contas Poupança
        let saldoInicial = 0;
        if (tipo === 'Poupanca') {
            saldoInicial = 0; // Inicialmente 0, mas exigirá saldo positivo na criação
        }

        const newConta = await Conta.create({
            numero: parseInt(numero, 10),
            saldo: saldoInicial,
            senha: hashedPassword,
            user: id,
            tipo
        });

        if (tipo === 'Bonus') {
            newConta.pontuacao = 10;
        }

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

        if (conta.tipo === 'Bonus') {
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

        // Verificar se o saldo é suficiente, considerando o limite para contas Simples e Bônus
        if (conta.tipo === 'Simples' || conta.tipo === 'Bonus') {
            if (conta.saldo - valor < -1000) {
                throw new Error('Saldo insuficiente (limite de R$ -1.000,00 para contas Simples e Bônus)');
            }
        } else {
            if (conta.saldo < valor) {
                throw new Error('Saldo insuficiente');
            }
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

        // Verificar saldo na conta de origem
        if (fromConta.tipo === 'Simples' || fromConta.tipo === 'Bonus') {
            if (fromConta.saldo - valor < -1000) {
                throw new Error('Saldo insuficiente na conta de origem (limite de R$ -1.000,00 para contas Simples e Bônus)');
            }
        } else {
            if (fromConta.saldo < valor) {
                throw new Error('Saldo insuficiente na conta de origem');
            }
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

        if (conta.tipo !== 'Poupanca') {
            throw new Error('Operação permitida apenas para contas do tipo Poupança');
        }

        const juros = conta.saldo * (taxa / 100);
        conta.saldo += juros;

        await conta.save();
        return conta;
    }
}

export default new ContaService();
