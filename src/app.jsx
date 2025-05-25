import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/authContext.jsx';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "../supabaseClient.js";
import { Mensaje } from './context/mensaje.jsx';
import Login from './pages/login/login.jsx';
import Dashboard from './pages/dashboard/dashboard.jsx';
import Empleados from './pages/empleados/empleados.jsx';
import NuevoEmpleado from './pages/empleados/nuevoEmpleado.jsx';
import EditarEmpleado from './pages/empleados/editarEmpleado.jsx';
import Productos from './pages/productos/productos.jsx';
import NuevoProducto from './pages/productos/nuevoProducto.jsx';
import EditarProducto from './pages/productos/editarProducto.jsx';
import ConfigPerfil from './pages/configuracionPerfil/configPerfil.jsx';


function App() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login"); // o donde tengas tu ruta de login
      }
    };

    checkSession();
  }, []);


  if (loading) return <p>Cargando...</p>;

  return (
    <Mensaje>
      <Routes>
        {/* Si no hay usuario, se muestra Login */}
        <Route path="/" element={user ? <Dashboard /> : <Login />} />
        <Route path="/login" element={user ? <Dashboard /> : <Login />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Login />} />
        <Route path="/empleados" element={user ? <Empleados /> : <Login />} />
        <Route path="/empleados/nuevoEmpleado" element={user ? <NuevoEmpleado /> : <Login />} />
        <Route path="/empleados/editarEmpleado/:id" element={user ? <EditarEmpleado /> : <Login />} />
        <Route path="/productos" element={user ? <Productos /> : <Login />} />
        <Route path="/productos/nuevoProducto" element={user ? <NuevoProducto /> : <Login />} />
        <Route path="/productos/editarProducto/:id" element={user ? <EditarProducto /> : <Login />} />
        <Route path="/configPerfil" element={user ? <ConfigPerfil /> : <Login />} />
      </Routes>
    </Mensaje>
  );
}

export default App;
