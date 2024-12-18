import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirecionar
import UserService from '../services/UserService'; // Supondo que tenha um serviço para lidar com o registro

const Register = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [error, setError] = useState(null);
    const [sucesso, setSucesso] = useState(null); // Para armazenar mensagem de sucesso
    const navigate = useNavigate(); // Hook do React Router para navegação

    const handleRegister = async (e) => {
        e.preventDefault(); // Evita o reload da página

        // Validação simples de senha e confirmação de senha
        if (senha !== confirmarSenha) {
            setError("As senhas não coincidem!");
            return;
        }

        try {
            // Cria o objeto com os dados do novo usuário
            const novoUsuario = {
                nome,
                email,
                senha,
            };

            // Chama o método de criar usuário do UserService
            await UserService.criar(novoUsuario);

            // Exibe a mensagem de sucesso
            setSucesso('Usuário criado com sucesso!');

            // Após 2 segundos, redireciona para a página de login
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.message); // Exibe o erro na tela
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 via-green-100 to-green-200">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Criar Conta</h2>

                {/* Exibindo mensagem de erro ou sucesso */}
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {sucesso && <p className="text-green-500 text-center mb-4">{sucesso}</p>}

                <form onSubmit={handleRegister} className="space-y-6">
                    {/* Campo de nome */}
                    <div>
                        <label className="block text-gray-700 text-sm mb-2">Nome</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
                            placeholder="Digite seu nome"
                        />
                    </div>

                    {/* Campo de email */}
                    <div>
                        <label className="block text-gray-700 text-sm mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
                            placeholder="Digite seu email"
                        />
                    </div>

                    {/* Campo de senha */}
                    <div>
                        <label className="block text-gray-700 text-sm mb-2">Senha</label>
                        <input
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
                            placeholder="Digite sua senha"
                        />
                    </div>

                    {/* Campo de confirmação de senha */}
                    <div>
                        <label className="block text-gray-700 text-sm mb-2">Confirmar Senha</label>
                        <input
                            type="password"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
                            placeholder="Confirme sua senha"
                        />
                    </div>

                    {/* Botão de registro */}
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 focus:ring-2 focus:ring-green-400 transition duration-200"
                    >
                        Criar Conta
                    </button>
                </form>

                {/* Link para login */}
                <p className="text-gray-600 text-center mt-4 text-sm">
                    Já tem uma conta?{' '}
                    <a href="/" className="text-green-500 hover:underline">
                        Faça login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;
