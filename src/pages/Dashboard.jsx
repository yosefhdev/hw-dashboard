import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/db/supabase';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener la información del usuario actual
        const getCurrentUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };

        getCurrentUser();
    }, []);

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error.message);
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <h1>Bienvenido al Dashboard</h1>
            {user && (
                <div>
                    <p>Email: {user.email}</p>
                    <p>ID de usuario: {user.id}</p>
                    <p>Último inicio de sesión: {new Date(user.last_sign_in_at).toLocaleString()}</p>
                </div>
            )}
            <button onClick={handleSignOut}>Cerrar sesión</button>
        </div>
    );
}

export default Dashboard;