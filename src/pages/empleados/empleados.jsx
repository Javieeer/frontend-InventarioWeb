import { useEffect, useState, useRef } from "react";
import {
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
  useMediaQuery,
  Stack,
  Typography,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../../context/authContext";
import { styles } from "../../styles/dashboard";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { usarMensaje } from "../../context/mensaje";
import Saludo from "../../components/saludo";
import MenuLateral from "../../components/menuLateral";

const Empleados = () => {
  const { userData } = useAuth();
  const { mostrarMensaje } = usarMensaje();
  const [empleados, setEmpleados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isAdmin = userData?.rol === "admin";

  const cargarEmpleados = async () => {
    const { data, error } = await supabase.from("users").select("nombre, apellido, documento, rol, email, id");
    if (!error) setEmpleados(data);
  };

  const buscarEmpleados = () => {
    const filtrados = empleados.filter(e =>
      Object.values(e).some(valor => valor.toLowerCase().includes(busqueda.toLowerCase()))
    );
    setEmpleados(filtrados);
  };

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
  };

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

  useEffect(() => {
    cargarEmpleados();
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={styles.dashboardContainer}>
      <CssBaseline />

      {/* Barra superior elegante */}
      {isMobile && (
        <AppBar
          elevation={3}
          sx={{
            background: "linear-gradient(90deg, #1976d2 0%, #1565c0 100%)"
          }}
        >
          <Toolbar sx={{ minHeight: 56, px: 1, display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={() => setDrawerOpen(true)}
                sx={{ mr: 1, margin: 0 }}
              >
                <MenuIcon />
              </IconButton>
              <Saludo simple />
            </Box>
          </Toolbar>
        </AppBar>
      )}
      {!isMobile && <Saludo />}

      {/* Menu lateral */}
      <MenuLateral
        rol={isAdmin}
        mobileOpen={drawerOpen}
        setMobileOpen={setDrawerOpen}
      />

      {/* Contenido de la pagina */}
      <Box component="main" sx={{
        ...styles.mainContent,
        width: isMobile ? "100%" : "auto",
        minWidth: 0,
        p: isMobile ? 1 : 3,
      }}>
        {isAdmin ? (
          <Box sx={{
            paddingTop: isMobile ? "64px" : 4,
          }}>
            {/* Sección de búsqueda */}
            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={2}
              mb={2}
              alignItems={isMobile ? "stretch" : "center"}
              justifyContent="center"
            >
              <TextField
                label="Buscar empleados"
                variant="outlined"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                fullWidth={isMobile}
              />
              <Button variant="contained" onClick={buscarEmpleados} fullWidth={isMobile}>Buscar</Button>
              <Button variant="outlined" onClick={limpiarBusqueda} fullWidth={isMobile}>Limpiar</Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => navigate("/empleados/nuevoEmpleado")}
                fullWidth={isMobile}
              >
                Crear empleado
              </Button>
            </Stack>

            {/* Vista responsiva */}
            {isMobile ? (
              <Stack spacing={2}>
                {empleados.map((e) => (
                  <Paper
                    key={e.id}
                    sx={{
                      p: 2,
                      textAlign: 'left',
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,                  
                      boxShadow: 1,                     
                    }}
                  >
                    <Typography variant="subtitle1"><b>Nombre:</b> {e.nombre}</Typography>
                    <Typography variant="subtitle1"><b>Apellido:</b> {e.apellido}</Typography>
                    <Typography variant="subtitle1"><b>Documento:</b> {e.documento}</Typography>
                    <Typography variant="subtitle1"><b>Rol:</b> {e.rol}</Typography>
                    <Typography variant="subtitle1"><b>Correo:</b> {e.email}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <IconButton
                        onClick={() => handleEdit(e)}
                        sx={{ color: 'gray' }}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => eliminarEmpleado(e.id)}
                        sx={{ color: 'gray' }}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            ) : (
              // Tabla en escritorio
              <Box sx={{ width: "100%" }}>
                <TableContainer component={Paper}>
                  <Table size="medium" sx={{ minWidth: 600 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Apellido</TableCell>
                        <TableCell>Documento</TableCell>
                        <TableCell>Rol</TableCell>
                        <TableCell>Correo</TableCell>
                        <TableCell align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {empleados.map((e) => (
                        <TableRow key={e.id}>
                          <TableCell>{e.nombre}</TableCell>
                          <TableCell>{e.apellido}</TableCell>
                          <TableCell>{e.documento}</TableCell>
                          <TableCell>{e.rol}</TableCell>
                          <TableCell>{e.email}</TableCell>
                          <TableCell sx={{ p: 0 }}>
                            <IconButton
                              onClick={() => handleEdit(e)}
                              sx={{ color: 'gray' }}
                              size="medium"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => eliminarEmpleado(e.id)}
                              sx={{ color: 'gray' }}
                              size="medium"
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
          </Box>
        ) : (
          <Box>
            <Typography variant="h5" align="center" color="error" gutterBottom>
              Acceso denegado
            </Typography>
            <Typography align="center">
              No tienes permiso para acceder a esta sección.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Empleados;