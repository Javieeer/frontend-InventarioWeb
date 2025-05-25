import { useEffect, useState } from "react";
import {
  Toolbar,
  CssBaseline,
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../../context/AuthContext";
import { styles } from "../../styles/dashboard";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { usarMensaje } from "../../context/mensaje";
import Saludo from "../../components/saludo";
import MenuLateral from "../../components/menuLateral";

const Empleados = () => {

  /* Declaramos estados necesarios para la ruta de empleados */
  const { userData } = useAuth();
  const { mostrarMensaje } = usarMensaje();
  const [empleados, setEmpleados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  /* Definimos el rol para mostrar o no la db de empleados */
  const isAdmin = userData?.rol === "admin";

  /* Guardamos en empleados los empleados de la base de datos */
  const cargarEmpleados = async () => {
    const { data, error } = await supabase.from("users").select("nombre, apellido, documento, rol, email, id");
    if (!error) setEmpleados(data);
  };

  /* Buscamos los empleados que coincidan con la busqueda y actualizamos empleados*/
  const buscarEmpleados = () => {
    const filtrados = empleados.filter(e =>
      Object.values(e).some(valor => valor.toLowerCase().includes(busqueda.toLowerCase()))
    );
    setEmpleados(filtrados);
  };

  /* Limpiamos los resultados y volvemos a cargar todos los empleados */
  const limpiarBusqueda = () => {
    setBusqueda("");
    cargarEmpleados();
  };

  const handleEdit = (e) => {
    if (userData.id === e.id) {
      mostrarMensaje("No puedes editar tu propio usuario.", "error");
      return;
    } else {
      navigate(`/empleados/editarEmpleado/${e.id}`, { state: { e } });
    }
  }

  /* Eliminamos empleado siempre y cuando no seas tu mismo */
  const eliminarEmpleado = async (id) => {
    if (userData.id === id) {
      mostrarMensaje("No puedes eliminar tu propio usuario.", "error");
      return;
    } else {
      await fetch("http://localhost:3001/eliminarUsuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          mostrarMensaje(data.error, "error");
        } else {
          mostrarMensaje("Empleado eliminado con éxito.", "success");
          cargarEmpleados();
        }
      });
    }
  };

  /* Tan pronto como se carga la pagina se cargan todos los empleados */
  useEffect(() => {
    cargarEmpleados();
  }, []);

  return (
    /* Container principal */
    <Box sx={styles.dashboardContainer}>
      <CssBaseline />

      {/* Saludo */}
      <Saludo />

      {/* Menu lateral */}
      <MenuLateral rol = { isAdmin } />

      {isAdmin && (
        /* Contenido de la pagina */
        <Box component="main" sx={styles.mainContent}>
          <Toolbar />

          {/* Sección de busqueda */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'center' }}>
            <TextField label="Buscar empleados" variant="outlined" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            <Button variant="contained" onClick={buscarEmpleados}>Buscar</Button>
            <Button variant="outlined" onClick={limpiarBusqueda}>Limpiar</Button>
            <Button variant="contained" color="success" onClick={() => navigate("/empleados/nuevoEmpleado")}>Crear empleado</Button>
          </Box>

          {/* Tabla de empleados */}
          <TableContainer component={Paper}>
            <Table>
              {/* Encabezados */}
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Apellido</TableCell>
                  <TableCell>Documento</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Correo</TableCell>
                  <TableCell >Acciones</TableCell>
                </TableRow>
              </TableHead>
              {/* Datos de la tabla por fila */}
              <TableBody>
                {empleados.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{e.nombre}</TableCell>
                    <TableCell>{e.apellido}</TableCell>
                    <TableCell>{e.documento}</TableCell>
                    <TableCell>{e.rol}</TableCell>
                    <TableCell>{e.email}</TableCell>
                    <TableCell sx={{ display: 'flex' }}>
                    <IconButton 
                      onClick={() => handleEdit(e)} 
                      sx={{ color: 'gray', marginRight: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => eliminarEmpleado(e.id)} 
                      sx={{ color: 'gray' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </TableContainer>
        </Box>
      )}
      
      {/* Si no es admin, mostramos un mensaje */}
      {!isAdmin && (
        <Box component="main" sx={styles.mainContent}>
          <Toolbar />
          <h1>Acceso denegado</h1>
          <p>No tienes permiso para acceder a esta sección.</p>
        </Box>
      )}
    </Box>
  );
};

export default Empleados;
