import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./pages/Home";
import Register from "./components/Register";
import Conta from "./components/Conta";
import NotFound from "./pages/NotFound";

function App() {
    const [token, setToken] = useState(localStorage.getItem("token"));

    useEffect(() => {
        // Verifica o token no localStorage sempre que mudar
        const handleStorageChange = () => setToken(localStorage.getItem("token"));
        window.addEventListener("storage", handleStorageChange);

        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={token ? <Home /> : <Navigate to="/" replace />} />
                <Route path="/register" element={<Register />} />
                <Route path="/conta" element={token ? <Conta /> : <Navigate to="/" replace />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
