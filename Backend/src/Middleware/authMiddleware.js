import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido ou formato inválido.' });
    }

    const token = authHeader.replace('Bearer ', ''); // Remove o prefixo "Bearer "

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adiciona o usuário decodificado à requisição
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido.' });
    }
}

export default authMiddleware;