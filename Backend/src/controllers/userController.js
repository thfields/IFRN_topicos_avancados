import UserService from '../services/userService.js';

async function getUsers(_, res) {
    try {
        const users = await UserService.find();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar usuários.', details: error.message });
    }
}

async function getUserById(req, res) {
    const userId = req.params.userId;

    try {
        const user = await UserService.findOne(userId);
        return res.status(200).json(user);
    } catch (error) {
        if (error.message === 'User não encontrada') {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro ao buscar o usuário.', details: error.message });
    }
}

async function createUser(req, res) {
    const { nome, email, senha } = req.body;

    try {
        const newUser = await UserService.create({ nome, email, senha });
        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(400).json({ error: 'Erro ao criar o usuário.', details: error.message });
    }
}

async function updateUser(req, res) {
    const userId = req.params.userId;
    const updateData = req.body;

    try {
        const updatedUser = await UserService.update(userId, updateData);
        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(400).json({ error: 'Erro ao atualizar o usuário.', details: error.message });
    }
}

async function deleteUser(req, res) {
    const userId = req.params.userId;

    try {
        const deletedUser = await UserService.delete(userId);
        return res.status(200).json(deletedUser);
    } catch (error) {
        return res.status(400).json({ error: 'Erro ao deletar o usuário.', details: error.message });
    }
}

export { getUsers, getUserById, createUser, updateUser, deleteUser };
