import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

class UserService {
    async find() {
        return await User.find();
    }

    async findOne(userId) {
        const user = await User.findOne({userId: userId});
        if (!user) {
            throw new Error('User não encontrada');
        }
        return user;
    }

    async create(userData) {
        if (!userData.nome || !userData.email || !userData.senha) {
            throw new Error('Os campos nome, email e senha são obrigatórios');
        }

        const hashedPassword = await bcrypt.hash(userData.senha, 10); // Hash da senha
    
        userData.senha = hashedPassword;

        return await User.create(userData);
    }

    async update(userId, updateData) {
        const allowedUpdates = ['nome', 'email', 'senha'];
        const updates = {};
    
        for (const key of allowedUpdates) {
            if (updateData[key] !== undefined) {
                updates[key] = updateData[key];
            }
        }
    
        if (Object.keys(updates).length === 0) {
            throw new Error('Nenhum campo válido para atualização foi fornecido');
        }
    
        const updatedUser = await User.findOneAndUpdate(
            { userId: userId },
            updates,
            { new: true }
        );
    
        if (!updatedUser) {
            throw new Error('Usuário não encontrado para atualização');
        }
    
        return updatedUser;
    }
    

    async delete(userId) {
        const user = await User.findOne({ userId: userId });

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        await User.deleteOne({ userId: userId });
        return { message: 'Usuário deletado com sucesso', user };
    }

    async login(email, senha) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        // Comparar senha com hash no banco
        const senhaCorreta = await bcrypt.compare(senha, user.senha);
        if (!senhaCorreta) {
            throw new Error('Senha incorreta');
        }

        // Gerar token JWT
        const token = jwt.sign(
            { userId: user.userId, email: user.email },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } // Token expira em 1 hora
        );

        return { token, user: { id: user.userId, nome: user.nome, email: user.email } };
    }
}

export default new UserService();