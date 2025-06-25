import { useEffect, useState } from "react";
import {
  CssBaseline,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../../context/authContext";
import { styles } from "../../styles/dashboard";
import { useNavigate } from "react-router-dom";
import { usarMensaje } from "../../context/mensaje";
import { supabase } from "../../../supabaseClient";
import Saludo from "../../components/saludo";
import MenuLateral from "../../components/menuLateral";

const ConfigPerfil = () => {
  const { userData } = useAuth();
  const { mostrarMensaje } = usarMensaje();
  const isAdmin = userData?.rol === "admin";
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    rol: "",
    contraseña: "",
    confirmarContraseña: "",
  });
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  

  useEffect(() => {
    if (userData) {
      setPerfil({
        nombre: userData.nombre || "",
        apellido: userData.apellido || "",
        correo: userData.email || "",
        rol: userData.rol || "",
        contraseña: "",
        confirmarContraseña: "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerfil((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let correoDataBase = false;
    let correoAutentication = false;

    try {
      // Obtener el token
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        mostrarMensaje("No se pudo obtener el token de sesión", "error");
        return;
      }

      // Actualizar en la tabla users
      const { error: updateError } = await supabase
        .from("users")
        .update({
          nombre: perfil.nombre,
          apellido: perfil.apellido,
          ...(isAdmin && perfil.correo ? { email: perfil.correo } : {}),
        })
        .eq("id", userData.id);

      if (updateError) {
        mostrarMensaje("Error al actualizar en la base de datos", "error");
      } else {
        correoDataBase = true;
      }

      // Actualizar en Supabase Auth
      const response = await fetch(`${import.meta.env.VITE_API_URL}/mi-perfil`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: isAdmin ? perfil.correo : undefined,
          password: perfil.contraseña || undefined,
        }),
      });

      if (response.ok) {
        correoAutentication = true;
      } else {
        mostrarMensaje("Error al actualizar en la autenticación", "error");
      }

      if (correoDataBase && correoAutentication) {
        mostrarMensaje("Datos actualizados exitosamente. Cerrando sesión...", "success");

        const cerrarSesionYRedirigir = async () => {
          await supabase.auth.signOut({ scope: 'global' });
          navigate("/login");
        };

        setTimeout(() => {
          cerrarSesionYRedirigir();
        }, 2000);
      } else {
        mostrarMensaje("Error al actualizar los datos", "error");
      }
    } catch (err) {
      mostrarMensaje("Error inesperado", "error");
    } finally {
      setLoading(false);
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

      <Box component="main" sx={styles.mainContent}>
        <Paper
          elevation={4}
          sx={{
            p: isMobile ? 2 : 4,
            borderRadius: 3,
            maxWidth: 600,
            mx: "auto",
            mt: isMobile ? 8 : 4,
          }}
        >
          <Typography variant="h5" gutterBottom align="center" sx={{ mb: isMobile ? 3 : 5 }}>
            Configuración de Perfil
          </Typography>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
            autoComplete="off"
          >
            <Grid
              container
              spacing={isMobile ? 2 : 3}
              sx={{ width: "100%", justifyContent: "center" }}
            >
              <Grid xs={12}>
                <TextField
                  label="Nombre"
                  name="nombre"
                  value={perfil.nombre}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid xs={12}>
                <TextField
                  label="Apellido"
                  name="apellido"
                  value={perfil.apellido}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid xs={12}>
                <TextField
                  label={isAdmin ? "Nuevo correo" : "Correo actual"}
                  name="correo"
                  value={perfil.correo}
                  onChange={handleChange}
                  fullWidth
                  disabled={!isAdmin}
                />
              </Grid>

              <Grid xs={12}>
                <TextField
                  label="Rol"
                  name="rol"
                  value={perfil.rol}
                  fullWidth
                  disabled
                />
              </Grid>

              <Grid xs={12}>
                <TextField
                  label="Nueva contraseña"
                  name="contraseña"
                  type="password"
                  value={perfil.contraseña}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid xs={12}>
                <TextField
                  label="Confirmar contraseña"
                  name="confirmarContraseña"
                  type="password"
                  value={perfil.confirmarContraseña}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                mt: isMobile ? 2 : 4,
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 2,
                width: "100%",
                alignItems: "stretch",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth={isMobile}
              >
                {loading ? "Actualizando..." : "Guardar cambios"}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/dashboard")}
                fullWidth={isMobile}
              >
                Cancelar
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default ConfigPerfil;