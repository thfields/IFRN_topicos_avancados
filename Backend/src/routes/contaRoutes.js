import { Router } from 'express';
import { createConta, getSaldo, creditConta, debitConta, transfer, getContas, renderJuros, getContaByNumero } from '../controllers/contaController.js';
import verificarSenhaConta from '../Middleware/contaMiddleware.js';
import authMiddleware from '../Middleware/authMiddleware.js';

const contaRoutes = Router();

contaRoutes.get('/banco/conta', authMiddleware, getContas);
contaRoutes.post('/banco/conta', authMiddleware, createConta);
contaRoutes.get('/banco/conta/:numero/saldo', authMiddleware, getSaldo);
contaRoutes.put('/banco/conta/:numero/credito', authMiddleware, verificarSenhaConta, creditConta);
contaRoutes.put('/banco/conta/:numero/debito', authMiddleware, verificarSenhaConta, debitConta);
contaRoutes.put('/banco/conta/:numero/transferencia', authMiddleware, verificarSenhaConta, transfer);
contaRoutes.put('/banco/conta/rendimento/:numero', authMiddleware, renderJuros);
contaRoutes.get('/banco/conta/:numero', authMiddleware, getContaByNumero);

export default contaRoutes;
