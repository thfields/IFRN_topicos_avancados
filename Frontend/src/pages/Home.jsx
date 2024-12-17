import { Link } from 'react-router-dom';
import logo from '../assets/sybank.png';

const Home = () => {
    return (
        <div className="home-container">
            <div className="logo-container">
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <img src={logo} alt="Logo" style={{width: 720, height: 420}}/>
            </div>
            </div>
            <div className="cta-container">
                <h2>Bem-vindo ao SyBank!</h2>
                <Link to="/conta" className="btn">Visualizar conta</Link>
            </div>
        </div>
    );
};

export default Home;