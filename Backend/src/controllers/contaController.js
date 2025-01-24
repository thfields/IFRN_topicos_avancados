import ContaService from '../services/contaService.js';

// Controladores
async function createConta(req, res) {
    const { numero, senha, tipo } = req.body;
    const id = req.user.id; 

    try {
        const newConta = await ContaService.createConta(numero, senha, id);
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
    const { paraConta, valor } = req.body; // `paraConta` vem do corpo da requisição
    const { numero } = req.params; // `numero` vem da URL

    try {
        // Valide e converta os valores
        if (!numero || isNaN(numero)) {
            throw new Error('Número da conta de origem inválido');
        }
        if (!paraConta || isNaN(paraConta)) {
            throw new Error('Número da conta de destino inválido');
        }
        if (!valor || isNaN(valor) || valor <= 0) {
            throw new Error('Valor de transferência inválido');
        }

        // Chamada ao serviço com valores convertidos
        const result = await ContaService.transfer(
            parseInt(numero, 10),
            parseInt(paraConta, 10),
            parseFloat(valor)
        );
        return res.status(200).json(result);
    } catch (error) {
        console.error('Erro na transferência:', error.message);
        return res.status(400).json({ error: error.message });
    }
}

async function renderJuros(req, res) {
    const { numero } = req.params; // Número da conta
    const { taxa } = req.body; // Taxa de juros

    try {
        const updatedConta = await ContaService.renderJuros(numero, parseFloat(taxa));
        return res.status(200).json(updatedConta);
    } catch (error) {
        console.error('Erro ao render juros:', error);
        return res.status(400).json({ error: error.message });
    }
}



export { createConta, getSaldo, creditConta, debitConta, transfer, getContas, renderJuros };
