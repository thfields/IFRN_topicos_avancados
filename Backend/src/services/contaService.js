import Conta from '../models/contaModel.js';
import bcrypt from 'bcryptjs';

class ContaService {
    async getContasByUser(id) {
        const contas = await Conta.find({ user: id });
        if (!contas || contas.length === 0) {
            throw new Error('Nenhuma conta encontrada para este usuário');
        }
        return contas;
    }

    async createConta(numero, senha, id, saldoInicial, tipo = 'Comum') {
        // Validação dos campos obrigatórios
        if (!numero || !senha || saldoInicial === undefined || saldoInicial < 0) {
            throw new Error('Número, senha e saldo inicial são obrigatórios. O saldo não pode ser negativo.');
        }

        // Validação do tipo de conta
        const tiposPermitidos = ['Comum', 'Poupanca', 'Bonus'];
        if (!tiposPermitidos.includes(tipo)) {
            throw new Error('Tipo de conta inválido. Use "Comum", "Poupanca" ou "Bonus".');
        }

        // Verifica se o número da conta já existe
        const existingConta = await Conta.findOne({ numero });
        if (existingConta) {
            throw new Error('Número de conta já existe.');
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(senha, 10);

        // Cria a nova conta
        const newConta = await Conta.create({
            numero: parseInt(numero, 10),
            saldo: saldoInicial,
            senha: hashedPassword,
            user: id,
            tipo: tipo,
            pontuacao: tipo === 'Bonus' ? 10 : 0 // Inicializa a pontuação para contas Bonus
        });

        return newConta;
    }

    async getSaldo(numero) {
        const conta = await Conta.findOne({ numero: parseInt(numero, 10) });
        if (!conta) {
            throw new Error('Conta não encontrada.');
        }
        return conta.saldo;
    }

    async creditConta(numero, valor) {
        if (valor <= 0) {
            throw new Error('Valor inválido para crédito.');
        }

        const conta = await Conta.findOne({ numero: parseInt(numero, 10) });
        if (!conta) {
            throw new Error('Conta não encontrada.');
        }

        conta.saldo += valor;

        // Bonificação para contas do tipo Bonus
        if (conta.tipo === 'Bonus') {
            if (!conta.pontuacao || isNaN(conta.pontuacao)) {
                conta.pontuacao = 0;
            }
            // 1 ponto para cada R$100 (sem arredondar)
            conta.pontuacao += valor / 100;
        }

        await conta.save();
        return conta;
    }

    async debitConta(numero, valor) {
        if (isNaN(valor) || valor <= 0) {
            throw new Error('Valor inválido para débito.');
        }

        const conta = await Conta.findOne({ numero: parseInt(numero, 10) });
        if (!conta) {
            throw new Error('Conta não encontrada.');
        }

        if (conta.saldo < valor) {
            throw new Error('Saldo insuficiente.');
        }

        conta.saldo -= valor;
        await conta.save();
        return conta;
    }

    async transfer(numero, paraConta, valor) {
        if (isNaN(valor) || valor <= 0) {
            throw new Error('Valor inválido para transferência.');
        }

        const fromConta = await Conta.findOne({ numero: parseInt(numero, 10) });
        const toConta = await Conta.findOne({ numero: parseInt(paraConta, 10) });

        if (!fromConta) {
            throw new Error('Conta de origem não encontrada.');
        }
        if (!toConta) {
            throw new Error('Conta de destino não encontrada.');
        }

        if (fromConta.saldo < valor) {
            throw new Error('Saldo insuficiente na conta de origem.');
        }

        fromConta.saldo -= valor;
        toConta.saldo += valor;

        // Bonificação para contas do tipo Bonus (conta de origem)
        if (fromConta.tipo === 'Bonus') {
            if (!fromConta.pontuacao || isNaN(fromConta.pontuacao)) {
                fromConta.pontuacao = 0;
            }
            // 1 ponto para cada R$200 (sem arredondar)
            fromConta.pontuacao += valor / 200;
        }

        await fromConta.save();
        await toConta.save();

        return { fromConta, toConta };
    }

    async renderJuros(taxa) {
        if (isNaN(taxa) || taxa <= 0) {
            throw new Error('Taxa de juros inválida. A taxa deve ser positiva.');
        }

        const contas = await Conta.find({ tipo: 'Poupanca' });
        if (!contas || contas.length === 0) {
            throw new Error('Nenhuma conta Poupança encontrada.');
        }

        const contasAtualizadas = [];
        for (const conta of contas) {
            const juros = conta.saldo * (taxa / 100);
            conta.saldo += juros;
            await conta.save();
            contasAtualizadas.push(conta);
        }

        return contasAtualizadas;
    }

    async getContaByNumero(numero) {
        const conta = await Conta.findOne({ numero: parseInt(numero, 10) });
        if (!conta) {
            throw new Error('Conta não encontrada.');
        }
        return {
            tipo: conta.tipo,
            numero: conta.numero,
            saldo: conta.saldo,
            pontos: conta.tipo === 'Bonus' ? conta.pontuacao : null
        };
    }
}

export default new ContaService();