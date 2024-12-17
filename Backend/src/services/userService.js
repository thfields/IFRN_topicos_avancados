import User from '../models/userModel.js';

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
}

export default new UserService();