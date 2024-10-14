
import { Link } from 'react-router-dom';

function Unauthorized() {
    return (
        <div className="unauthorized">
            <h1>Acceso No Autorizado</h1>
            <p>Lo sentimos, no tienes permiso para acceder a esta página.</p>
            <p>Por favor, inicia sesión para continuar.</p>
            <Link to="/">Ir a la página de inicio de sesión</Link>
        </div>
    );
}

export default Unauthorized;