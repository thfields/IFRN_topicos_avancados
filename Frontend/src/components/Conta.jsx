import React, { useState } from 'react';

const Conta = () => {
    const [contas, setContas] = useState({
        '12345': 1000, // Exemplo de conta com saldo de R$ 1000
        '67890': 500,  // Exemplo de conta com saldo de R$ 500
    });

    const [numeroConta, setNumeroConta] = useState('');
    const [valor, setValor] = useState('');
    const [numeroContaDestino, setNumeroContaDestino] = useState('');
    const [mensagem, setMensagem] = useState('');
    
    const consultarSaldo = () => {
        if (contas[numeroConta]) {
            setMensagem(`O saldo da conta ${numeroConta} é R$ ${contas[numeroConta].toFixed(2)}`);
        } else {
            setMensagem('Conta não encontrada.');
        }
    };


    const realizarCredito = () => {
        if (contas[numeroConta]) {
            setContas(prevContas => ({
                ...prevContas,
                [numeroConta]: prevContas[numeroConta] + parseFloat(valor),
            }));
            setMensagem(`R$ ${valor} foi creditado na conta ${numeroConta}. Novo saldo: R$ ${contas[numeroConta] + parseFloat(valor)}`);
        } else {
            setMensagem('Conta não encontrada.');
        }
    };

    const realizarDebito = () => {
        if (contas[numeroConta]) {
            const saldoAtual = contas[numeroConta];
            if (saldoAtual >= parseFloat(valor)) {
                setContas(prevContas => ({
                    ...prevContas,
                    [numeroConta]: saldoAtual - parseFloat(valor),
                }));
                setMensagem(`R$ ${valor} foi debitado da conta ${numeroConta}. Novo saldo: R$ ${contas[numeroConta] - parseFloat(valor)}`);
            } else {
                setMensagem('Saldo insuficiente.');
            }
        } else {
            setMensagem('Conta não encontrada.');
        }
    };

    const realizarTransferencia = () => {
        if (contas[numeroConta] && contas[numeroContaDestino]) {
            const saldoOrigem = contas[numeroConta];
            if (saldoOrigem >= parseFloat(valor)) {
                setContas(prevContas => ({
                    ...prevContas,
                    [numeroConta]: saldoOrigem - parseFloat(valor),
                    [numeroContaDestino]: prevContas[numeroContaDestino] + parseFloat(valor),
                }));
                setMensagem(`R$ ${valor} foi transferido da conta ${numeroConta} para a conta ${numeroContaDestino}.`);
            } else {
                setMensagem('Saldo insuficiente para a transferência.');
            }
        } else {
            setMensagem('Uma ou ambas as contas não foram encontradas.');
        }
    };

    return (
        <div className="conta-container">
            <h2>Gestão de Conta Bancária</h2>

            <div className="input-container">
                <label htmlFor="numeroConta">Número da Conta:</label>
                <input
                    type="text"
                    id="numeroConta"
                    value={numeroConta}
                    onChange={(e) => setNumeroConta(e.target.value)}
                    placeholder="Digite o número da conta"
                />
            </div>

            <div className="input-container">
                <label htmlFor="valor">Valor:</label>
                <input
                    type="number"
                    id="valor"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    placeholder="Digite o valor"
                />
            </div>

            <div className="input-container">
                <label htmlFor="numeroContaDestino">Número da Conta de Destino:</label>
                <input
                    type="text"
                    id="numeroContaDestino"
                    value={numeroContaDestino}
                    onChange={(e) => setNumeroContaDestino(e.target.value)}
                    placeholder="Digite o número da conta de destino"
                />
            </div>

            <div className="button-container">
                <button onClick={consultarSaldo}>Consultar Saldo</button>
                <button onClick={realizarCredito}>Realizar Crédito</button>
                <button onClick={realizarDebito}>Realizar Débito</button>
                <button onClick={realizarTransferencia}>Realizar Transferência</button>
            </div>

            {mensagem && <p>{mensagem}</p>}
        </div>
    );
};

export default Conta;
