import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from '@/db/supabase'; // Usamos el alias configurado
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import NotFound from "@/pages/NotFound";
import Unauthorized from "@/pages/Unauthorized";
import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';

function App() {

  // eslint-disable-next-line no-unused-vars
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Comprueba la sesión actual al cargar la aplicación
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Escucha los cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Limpia la suscripción al desmontar
    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;