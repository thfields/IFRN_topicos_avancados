import ContaService from '../services/contaService.js';

// Controladores
async function createConta(req, res) {
    const { numero, senha, tipo } = req.body;
    const id = req.user.id; 
    

    try {
        const newConta = await ContaService.createConta(numero, senha, id, tipo);
        return res.status(201).json(newConta);
    } catch (error) {
        console.error('Erro ao criar conta:', error);
        return res.status(400).json({ error: error.message });
    }
}

async function getContas(req, res) {
    const userId = req.user.id;

    try {
        const contas = await ContaService.getContasByUser(userId);
        return res.status(200).json(contas);
    } catch (error) {
        console.error('Erro ao buscar contas:', error);
        return res.status(404).json({ error: error.message });
    }
}

async function getSaldo(req, res) {
    const { numero } = req.params;

    try {
        const saldo = await ContaService.getSaldo(numero);
        return res.status(200).json({ numero, saldo });
    } catch (error) {
        console.error('Erro ao buscar saldo:', error);
        return res.status(404).json({ error: error.message });
    }
}

async function creditConta(req, res) {
    const { numero } = req.params;
    const { valor } = req.body;

      // Validação básica dos parâmetros
    if (!numero || isNaN(parseInt(numero, 10))) {
        return res.status(400).json({ error: 'Número da conta inválido ou não fornecido.' });
    }

    if (!valor || isNaN(parseFloat(valor))) {
        return res.status(400).json({ error: 'Valor inválido ou não fornecido.' });
    }


    try {
        const updatedConta = await ContaService.creditConta(numero, parseFloat(valor));
        return res.status(200).json(updatedConta);
    } catch (error) {
        console.error('Erro ao creditar conta:', error);
        return res.status(400).json({ error: error.message });
    }
}

async function debitConta(req, res) {
    const { numero } = req.params;
    const { valor } = req.body;

    try {
        const updatedConta = await ContaService.debitConta(numero, parseFloat(valor));
        return res.status(200).json(updatedConta);
    } catch (error) {
        console.error('Erro ao debitar conta:', error);
        return res.status(400).json({ error: error.message });
    }
}

async function transfer(req, res) {
    const { from, to, amount } = req.body; // Dados da transferência

    try {
        // Validação dos dados
        if (!from || !to || !amount || isNaN(amount) || amount <= 0) {
            throw new Error('Dados de transferência inválidos');
        }

        const result = await ContaService.transfer(from, to, parseFloat(amount));
        return res.status(200).json(result);
    } catch (error) {
        console.error('Erro na transferência:', error.message);
        return res.status(400).json({ error: error.message });
    }
}

async function renderJuros(req, res) {
    const { taxa } = req.body; // Taxa de juros

    try {
        const contasAtualizadas = await ContaService.renderJuros(parseFloat(taxa));
        return res.status(200).json(contasAtualizadas);
    } catch (error) {
        console.error('Erro ao render juros:', error);
        return res.status(400).json({ error: error.message });
    }
}

async function getContaByNumero(req, res) {
    const { numero } = req.params;

    try {
        const conta = await ContaService.getContaByNumero(numero);
        return res.status(200).json(conta);
    } catch (error) {
        console.error('Erro ao buscar conta:', error);
        return res.status(404).json({ error: error.message });
    }
}



export { createConta, getSaldo, creditConta, debitConta, transfer, getContas, renderJuros, getContaByNumero };