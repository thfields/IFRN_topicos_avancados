import ContaService from '../services/contaService.js';
import mongoose from 'mongoose';

async function createConta(req, res) {
    const { numero, senha } = req.body;
    const userId = new mongoose.Types.ObjectId(req.user.userId); 

    try {
        const newConta = await ContaService.createConta(numero, senha, userId);
        return res.status(201).json(newConta);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function getSaldo(req, res) {
    const { numero } = req.params;

    try {
        const saldo = await ContaService.getSaldo(numero);
        return res.status(200).json({ numero, saldo });
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
}

async function creditConta(req, res) {
    const { numero } = req.params;
    const { valor } = req.body;

    try {
        const updatedConta = await ContaService.creditConta(numero, valor);
        return res.status(200).json(updatedConta);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function debitConta(req, res) {
    const { numero } = req.params;
    const { valor } = req.body;

    try {
        const updatedConta = await ContaService.debitConta(numero, valor);
        return res.status(200).json(updatedConta);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function transfer(req, res) {
    const { fromNumero, toNumero, valor } = req.body;

    try {
        const result = await ContaService.transfer(fromNumero, toNumero, valor);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export { createConta, getSaldo, creditConta, debitConta, transfer };
