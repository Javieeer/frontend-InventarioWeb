import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  CssBaseline,
  FormControl,
  InputLabel,
  Select,
  useMediaQuery,
  IconButton,
  MenuItem
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import { supabase } from "../../../supabaseClient";
import { useAuth } from "../../context/authContext";
import { usarMensaje } from "../../context/mensaje";
import { useTheme } from "@mui/material/styles";
import Saludo from "../../components/saludo";
import MenuLateral from "../../components/menuLateral";
import { styles } from "../../styles/dashboard";

const EditarEmpleado = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { mostrarMensaje } = usarMensaje();
  const isAdmin = userData?.rol === "admin";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [empleado, setEmpleado] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    rol: "",
    email: ""
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const obtenerEmpleado = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        mostrarMensaje("Error al obtener empleado", "error");
        navigate("/empleados");
      } else {
        setEmpleado(data);
      }
    };

    obtenerEmpleado();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("users")
      .update(empleado)
      .eq("id", id);

    if (error) {
      mostrarMensaje("Error al actualizar el empleado", "error");
    } else {
      mostrarMensaje("Empleado actualizado correctamente", "success");
      navigate("/empleados");
    }
  };

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

      {isAdmin ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: isMobile ? "auto" : "80vh",
            width: "100vw",
            paddingTop: isMobile ? "92px" : 0, // deja espacio para el AppBar en móvil
            px: isMobile ? 1 : 0, // padding horizontal en móvil
            boxSizing: "border-box",
          }}
        >
          <Container maxWidth={isMobile ? false : "sm"} sx={{ p: 0 }}>
            <Paper
              elevation={4}
              sx={{
                p: isMobile ? 2 : 4,
                borderRadius: 3,
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <Typography variant="h5" align="center" gutterBottom>
                Editar Empleado
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3} sx={{ justifyContent: "center", paddingTop: "30px" }}>
                  <Grid item xs={12}>
                    <TextField
                      label="Nombre"
                      value={empleado.nombre}
                      onChange={(e) => setEmpleado({ ...empleado, nombre: e.target.value })}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Apellido"
                      value={empleado.apellido}
                      onChange={(e) => setEmpleado({ ...empleado, apellido: e.target.value })}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Correo"
                      value={empleado.email}
                      onChange={(e) => setEmpleado({ ...empleado, email: e.target.value })}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Documento"
                      value={empleado.documento}
                      onChange={(e) => setEmpleado({ ...empleado, documento: e.target.value })}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="rol-label">Rol</InputLabel>
                      <Select
                        labelId="rol-label"
                        name="rol"
                        value={empleado.rol}
                        label="Rol"
                        onChange={(e) => setEmpleado({ ...empleado, rol: e.target.value })}
                      >
                        <MenuItem value="admin">admin</MenuItem>
                        <MenuItem value="empleado">empleado</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    mt: 4,
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: 2,
                    justifyContent: "space-between",
                  }}
                >
                  <Button type="submit" variant="contained" color="primary" disabled={!isAdmin} fullWidth={isMobile}>
                    Actualizar
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate("/empleados")}
                    fullWidth={isMobile}
                  >
                    Cancelar
                  </Button>
                </Box>
              </form>
            </Paper>
          </Container>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            maxWidth: 400,
            marginTop: 4,
            width: "100vw",
            px: 2,
            boxSizing: "border-box",
          }}
        >
          <Typography variant="h5" color="error">
            Acceso denegado
          </Typography>
          <Typography variant="body1">
            Solo los administradores pueden editar empleados.
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/empleados")}
            fullWidth={isMobile}
          >
            Volver
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default EditarEmpleado;