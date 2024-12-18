import { Router } from 'express';
import { createConta, getSaldo, creditConta, debitConta, transfer, getContas } from '../controllers/contaController.js';
import verificarSenhaConta from '../Middleware/contaMiddleware.js';
import authMiddleware from '../Middleware/authMiddleware.js';

const contaRoutes = Router();

contaRoutes.get('/conta', authMiddleware, getContas);
contaRoutes.post('/conta', authMiddleware, createConta);
contaRoutes.get('/conta/:numero/saldo', authMiddleware, getSaldo);
contaRoutes.put('/conta/:numero/credito', authMiddleware, verificarSenhaConta, creditConta);
contaRoutes.put('/conta/:numero/debito', authMiddleware, verificarSenhaConta, debitConta);
contaRoutes.post('/conta/:numero/transfer', authMiddleware, verificarSenhaConta, transfer);

export default contaRoutes;
