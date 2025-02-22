import ContaService from '../services/contaService.js';
import Conta from '../models/contaModel.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;
let userId;

// Configuração do ambiente de teste
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 30000,
    });

    // Limpa o banco de dados antes de rodar os testes
    await Conta.deleteMany({});

    // Cria um usuário de teste (simulado)
    userId = new mongoose.Types.ObjectId(); // Simula um ID de usuário
});

// Encerra o ambiente de teste
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

// Limpa o banco de dados antes de cada teste
beforeEach(async () => {
    await Conta.deleteMany({});
});

describe('Testes para o service de contas', () => {
    // Testes para Cadastrar Conta
    describe('Cadastrar Conta', () => {
        it('Deve cadastrar uma conta do tipo Comum (valor padrão)', async () => {
            const novaConta = await ContaService.createConta(123, 'senha123', userId, 100); // Tipo não especificado
            expect(novaConta).toHaveProperty('numero', 123);
            expect(novaConta).toHaveProperty('tipo', 'Comum'); // Tipo padrão
        });

        it('Deve cadastrar uma conta do tipo Poupança', async () => {
            const novaConta = await ContaService.createConta(456, 'senha456', userId, 100, 'Poupanca');
            expect(novaConta).toHaveProperty('numero', 456);
            expect(novaConta).toHaveProperty('tipo', 'Poupanca');
        });

        it('Deve cadastrar uma conta do tipo Bônus', async () => {
            const novaConta = await ContaService.createConta(789, 'senha789', userId, 100, 'Bonus');
            expect(novaConta).toHaveProperty('numero', 789);
            expect(novaConta).toHaveProperty('tipo', 'Bonus');
        });
    });

    // Testes para Consultar Conta
    describe('Consultar Conta', () => {
        it('Deve consultar uma conta do tipo Comum', async () => {
            await Conta.create({ numero: 123, senha: 'senha123', user: userId, tipo: 'Comum' });
            const conta = await ContaService.getContaByNumero(123);
            expect(conta).toHaveProperty('numero', 123);
            expect(conta).toHaveProperty('tipo', 'Comum');
        });

        it('Deve consultar uma conta do tipo Poupança', async () => {
            await Conta.create({ numero: 456, senha: 'senha456', user: userId, tipo: 'Poupanca' });
            const conta = await ContaService.getContaByNumero(456);
            expect(conta).toHaveProperty('numero', 456);
            expect(conta).toHaveProperty('tipo', 'Poupanca');
        });

        it('Deve consultar uma conta do tipo Bônus', async () => {
            await Conta.create({ numero: 789, senha: 'senha789', user: userId, tipo: 'Bonus' });
            const conta = await ContaService.getContaByNumero(789);
            expect(conta).toHaveProperty('numero', 789);
            expect(conta).toHaveProperty('tipo', 'Bonus');
        });
    });

    // Testes para Consultar Saldo
    describe('Consultar Saldo', () => {
        it('Deve retornar o saldo de uma conta', async () => {
            await Conta.create({ numero: 123, saldo: 100, senha: 'senha123', user: userId, tipo: 'Comum' });
            const saldo = await ContaService.getSaldo(123);
            expect(saldo).toBe(100);
        });
    });

    // Testes para Crédito
    describe('Crédito', () => {
        it('Deve realizar um crédito em uma conta (caso normal)', async () => {
            await Conta.create({ numero: 123, saldo: 100, senha: 'senha123', user: userId, tipo: 'Comum' });
            const contaAtualizada = await ContaService.creditConta(123, 50);
            expect(contaAtualizada).toHaveProperty('saldo', 150);
        });

        it('Não deve permitir crédito com valor negativo', async () => {
            await Conta.create({ numero: 123, saldo: 100, senha: 'senha123', user: userId, tipo: 'Comum' });
            await expect(ContaService.creditConta(123, -50)).rejects.toThrow('Valor inválido para crédito.');
        });

        it('Deve aplicar bonificação para contas do tipo Bônus', async () => {
            await Conta.create({ numero: 123, saldo: 100, senha: 'senha123', user: userId, tipo: 'Bonus', pontuacao: 0 });
            const contaAtualizada = await ContaService.creditConta(123, 50);
            expect(contaAtualizada).toHaveProperty('saldo', 150);
            expect(contaAtualizada).toHaveProperty('pontuacao', 0.5); // 1 ponto para cada R$100
        });
    });

    // Testes para Débito
    describe('Débito', () => {
        it('Deve realizar um débito em uma conta (caso normal)', async () => {
            await Conta.create({ numero: 123, saldo: 100, senha: 'senha123', user: userId, tipo: 'Comum' });
            const contaAtualizada = await ContaService.debitConta(123, 50);
            expect(contaAtualizada).toHaveProperty('saldo', 50);
        });

        it('Não deve permitir débito com valor negativo', async () => {
            await Conta.create({ numero: 123, saldo: 100, senha: 'senha123', user: userId, tipo: 'Comum' });
            await expect(ContaService.debitConta(123, -50)).rejects.toThrow('Valor inválido para débito.');
        });

        it('Não deve permitir débito que deixe o saldo negativo', async () => {
            await Conta.create({ numero: 123, saldo: 100, senha: 'senha123', user: userId, tipo: 'Comum' });
            await expect(ContaService.debitConta(123, 150)).rejects.toThrow('Saldo insuficiente.');
        });
    });

    // Testes para Transferência
    describe('Transferência', () => {
        it('Não deve permitir transferência com valor negativo', async () => {
            await Conta.create({ numero: 123, saldo: 100, senha: 'senha123', user: userId, tipo: 'Comum' });
            await Conta.create({ numero: 456, saldo: 200, senha: 'senha456', user: userId, tipo: 'Comum' });
            await expect(ContaService.transfer(123, 456, -50)).rejects.toThrow('Valor inválido para transferência.');
        });

        it('Não deve permitir transferência que deixe o saldo negativo', async () => {
            await Conta.create({ numero: 123, saldo: 100, senha: 'senha123', user: userId, tipo: 'Comum' });
            await Conta.create({ numero: 456, saldo: 200, senha: 'senha456', user: userId, tipo: 'Comum' });
            await expect(ContaService.transfer(123, 456, 150)).rejects.toThrow('Saldo insuficiente na conta de origem.');
        });

        it('Deve aplicar bonificação para contas do tipo Bônus na transferência', async () => {
            await Conta.create({ numero: 123, saldo: 100, senha: 'senha123', user: userId, tipo: 'Bonus', pontuacao: 0 });
            await Conta.create({ numero: 456, saldo: 200, senha: 'senha456', user: userId, tipo: 'Comum' });
            const result = await ContaService.transfer(123, 456, 50);
            expect(result.fromConta.saldo).toBe(50);
            expect(result.fromConta.pontuacao).toBe(0.25); // 1 ponto para cada R$200
            expect(result.toConta.saldo).toBe(250);
        });
    });

    // Testes para Render Juros
    describe('Render Juros', () => {
        it('Deve render juros para contas do tipo Poupança', async () => {
            await Conta.create({ numero: 123, saldo: 100, senha: 'senha123', user: userId, tipo: 'Poupanca' });
            const contasAtualizadas = await ContaService.renderJuros(10); // 10% de juros
            expect(contasAtualizadas[0].saldo).toBe(110); // Saldo inicial (100) + juros (10)
        });
    });
});