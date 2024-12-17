const BASE_URL_USERS = '/api';

const getToken = () => localStorage.getItem('token');

const UserService = {
    listar: async () => {
        const resposta = await fetch(`${BASE_URL_USERS}/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            mode: 'cors',
        });
        if (!resposta.ok) {
            const errorData = await resposta.json();
            throw new Error(errorData.message || 'Erro ao listar usuários');
        }
        return await resposta.json();
    },

    buscarPorId: async (userId) => {
        const resposta = await fetch(`${BASE_URL_USERS}/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            mode: 'cors',
        });
        if (!resposta.ok) {
            const errorData = await resposta.json();
            throw new Error(errorData.message || 'Erro ao buscar usuário');
        }
        return await resposta.json();
    },

    criar: async (user) => {
        const resposta = await fetch(`${BASE_URL_USERS}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
            mode: 'cors',
        });
        if (!resposta.ok) {
            const errorData = await resposta.json();
            throw new Error(errorData.message || 'Erro ao criar usuário');
        }
        return await resposta.json();
    },

    atualizar: async (userId, userData) => {
        const resposta = await fetch(`${BASE_URL_USERS}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(userData),
            mode: 'cors',
        });
        if (!resposta.ok) {
            const errorData = await resposta.json();
            throw new Error(errorData.message || 'Erro ao atualizar usuário');
        }
        return await resposta.json();
    },

    excluir: async (userId) => {
        const resposta = await fetch(`${BASE_URL_USERS}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            mode: 'cors',
        });
        const responseData = await resposta.json();
        if (!resposta.ok) {
            throw new Error(responseData.message || 'Erro ao excluir usuário');
        }
        return responseData.message;
    },

    login: async (email, senha) => {
        const resposta = await fetch(`${BASE_URL_USERS}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha }),
            mode: 'cors',
        });
        const responseData = await resposta.json();
        if (!resposta.ok) {
            throw new Error(responseData.message || 'Erro ao realizar login');
        }
        return responseData; // Retorna token e dados do usuário
    },
};

export default UserService;
