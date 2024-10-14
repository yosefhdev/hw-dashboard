import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '@/db/supabase';

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAuthenticated(!!session);
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    if (isLoading) {
        // Puedes mostrar un spinner o mensaje de carga aquí
        return <div>Cargando...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;