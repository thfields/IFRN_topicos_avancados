import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirecionar
import UserService from '../services/UserService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook do React Router para navegação

    const handleLogin = async (e) => {
        e.preventDefault(); // Evita o reload da página

        try {
            const response = await UserService.login(email, senha);

            // Salva o token no localStorage
            localStorage.setItem('token', response.token);

            // Redireciona o usuário para a página Home
            navigate('/home');
        } catch (err) {
            setError(err.message); // Exibe o erro na tela
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">Login</h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Digite seu email"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Senha</label>
                        <input
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Digite sua senha"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        Entrar
                    </button>
                </form>

                <p className="text-gray-500 text-center mt-4">
                    Ainda não tem uma conta?{' '}
                    <a href="/register" className="text-blue-500 hover:underline">
                        Registre-se
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
