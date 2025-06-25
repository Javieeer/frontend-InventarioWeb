import { useState } from "react";
import {
  CssBaseline,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  useMediaQuery,
  Select,
  MenuItem
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../../context/authContext";
import { styles } from "../../styles/dashboard";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { usarMensaje } from "../../context/mensaje";
import Saludo from "../../components/saludo";
import MenuLateral from "../../components/menuLateral";

const NuevoEmpleado = () => {

  /* Declaramos estados necesarios */
  const { userData } = useAuth();
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    rol: "",
    email: "",
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { mostrarMensaje } = usarMensaje();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  /* Definimos el rol para mostrar o no la db de empleados */
  const isAdmin = userData?.rol === "admin";

  /* Función para manejar el cambio de los campos de entrada de texto */
  const handleChange = (e) => {
    setNuevoEmpleado({
      ...nuevoEmpleado,
      [e.target.name]: e.target.value,
    });
  };

  /* Función para crear un nuevo empleado */
  const crearEmpleado = async () => {
    const { nombre, apellido, documento, rol, email } = nuevoEmpleado;

    // Validación de campos vacíos
    if (!nombre || !apellido || !documento || !rol || !email) {
      mostrarMensaje("Todos los campos son obligatorios", "error");
      return;
    }

    // Validar que nombre y apellido no contengan números
    const contieneNumero = /\d/;
    if (contieneNumero.test(nombre) || contieneNumero.test(apellido)) {
      mostrarMensaje("Nombre y apellido no deben contener números.", "error");
      return;
    }

    // Validar que documento solo contenga números
    const soloNumeros = /^\d+$/;
    if (!soloNumeros.test(documento)) {
      mostrarMensaje("El documento debe contener solo números.", "error");
      return;
    }

    // Validar que el correo contenga un '@'
    if (!email.includes("@")) {
      mostrarMensaje("El correo debe contener el símbolo '@'.", "error");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: nuevoEmpleado.email,
      password: nuevoEmpleado.documento
    });

    // Si pasa todas las validaciones, insertar en Supabase
    const { user } = data;
    await supabase.from("users").insert([
      {
        id: user.id, // UUID del nuevo usuario autenticado
        nombre: nuevoEmpleado.nombre,
        apellido: nuevoEmpleado.apellido,
        documento: nuevoEmpleado.documento,
        rol: nuevoEmpleado.rol,
        email: nuevoEmpleado.email,
      },
    ]);
    if (!error) {
      mostrarMensaje("Empleado creado con éxito", "success");
      setTimeout(() => navigate("/empleados"), 1500); 
    } else {
      mostrarMensaje("Error al crear el empleado", "error");
    }
  };

  /* Función para cancelar la creación del nuevo empleado */
  const cancelar = () => {
    navigate(-1); // Volver atrás sin guardar
  };

  return (
    /* Container principal */
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

      {isAdmin && (
        /* Contenido de la pagina */
        <Box component="main" sx={styles.mainContent}>
          <Toolbar />

          <h1>Nuevo empleado</h1>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}>
            <TextField
              label="Nombre"
              name="nombre"
              value={nuevoEmpleado.nombre}
              onChange={handleChange}
            />
            <TextField
              label="Apellido"
              name="apellido"
              value={nuevoEmpleado.apellido}
              onChange={handleChange}
            />
            <TextField
              label="Documento"
              name="documento"
              value={nuevoEmpleado.documento}
              onChange={handleChange}
            />
            <FormControl fullWidth>
              <InputLabel id="rol-label">Rol</InputLabel>
              <Select
                labelId="rol-label"
                name="rol"
                value={nuevoEmpleado.rol}
                label="Rol"
                onChange={handleChange}
              >
                <MenuItem value="admin">admin</MenuItem>
                <MenuItem value="empleado">empleado</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Correo"
              name="email"
              value={nuevoEmpleado.email}
              onChange={handleChange}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="contained" onClick={crearEmpleado}>
                Guardar
              </Button>
              <Button variant="outlined" onClick={cancelar}>
                Cancelar
              </Button>
            </Box>
          </Box>
          
        </Box>
      )}
    </Box>
  );
};

export default NuevoEmpleado;