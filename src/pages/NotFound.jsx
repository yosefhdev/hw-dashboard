
import { Link } from 'react-router-dom';
import { supabase } from '@/db/supabase';
import { useEffect, useState } from 'react';

function NotFound() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAuthenticated(!!session);
        };

        checkAuth();
    }, []);

    return (
        <div className="not-found">
            <h1>404 - Página No Encontrada</h1>
            <p>Lo sentimos, la página que estás buscando no existe.</p>
            <p>Puede que hayas escrito mal la dirección o que la página se haya movido.</p>
            {isAuthenticated ? (
                <Link to="/dashboard">Volver al Dashboard</Link>
            ) : (
                <Link to="/">Ir a la página de inicio de sesión</Link>
            )}
        </div>
    );
}

export default NotFound;