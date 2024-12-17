import React, { useState } from 'react';
import UserService from '../services/UserService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault(); // Evita o reload da página

        try {
            // Chama o serviço de login
            const response = await UserService.login(email, senha);
            console.log('Login bem-sucedido:', response);

            // Salva o token no localStorage
            localStorage.setItem('token', response.token);

            // Aqui você pode redirecionar o usuário para outra página
            alert('Login realizado com sucesso!');
        } catch (err) {
            setError(err.message); // Exibe o erro na tela
        }
    };

    return (
        <div style={{ width: '300px', margin: '50px auto' }}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Senha:</label>
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
};

export default Login;
