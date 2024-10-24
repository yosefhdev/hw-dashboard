import { Button } from "@/components/ui/button"
import { useEffect } from "react";
import { Moon, Sun, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/db/supabase';

// eslint-disable-next-line react/prop-types
function Header({ activeTab = 'home', toggleTheme, isDark }) {
    const navigate = useNavigate();


    useEffect(() => {
        document.body.className = isDark ? 'dark' : 'light'
    }, [isDark])

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error.message);
        }
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{
                        activeTab === 'home' ? 'Dashboard de Autos' :
                            activeTab === 'add' ? 'Agregar Nuevo Auto' :
                                'Estadísticas'
                    }</h1>
                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" onClick={toggleTheme}>
                            {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleSignOut}>
                            <LogOut className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;