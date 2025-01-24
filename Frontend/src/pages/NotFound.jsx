import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>404</h1>
            <p>Página não encontrada!</p>
            <Link to="/"></Link>
        </div>
    );
};

export default NotFound;
