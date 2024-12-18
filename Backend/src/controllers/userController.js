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
    const id = req.params.id;

    try {
        const user = await UserService.findOne(id);
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
    const id = req.params.id;
    const updateData = req.body;

    try {
        const updatedUser = await UserService.update(id, updateData);
        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(400).json({ error: 'Erro ao atualizar o usuário.', details: error.message });
    }
}

async function deleteUser(req, res) {
    const id = req.params.id;

    try {
        const deletedUser = await UserService.delete(id);
        return res.status(200).json(deletedUser);
    } catch (error) {
        return res.status(400).json({ error: 'Erro ao deletar o usuário.', details: error.message });
    }
}

async function loginUser(req, res) {
    const { email, senha } = req.body;

    try {
        const { token, user } = await UserService.login(email, senha);
        return res.status(200).json({ message: 'Login bem-sucedido', token, user });
    } catch (error) {
        return res.status(401).json({ error: 'Falha no login', details: error.message });
    }
}

export { getUsers, getUserById, createUser, updateUser, deleteUser, loginUser };
