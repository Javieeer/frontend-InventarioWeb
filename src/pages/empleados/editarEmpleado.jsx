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
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { supabase } from "../../../supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { usarMensaje } from "../../context/mensaje";
import Saludo from "../../components/saludo";
import MenuLateral from "../../components/menuLateral";
import { styles } from "../../styles/dashboard";

const EditarEmpleado = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { mostrarMensaje } = usarMensaje();

  const isAdmin = userData?.rol === "admin";

  const [empleado, setEmpleado] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    rol: "",
    email: ""
  });

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
      <Saludo />
      <MenuLateral rol={isAdmin} />

      {isAdmin ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
          }}
        >
          <Container maxWidth="sm">
            <Paper elevation={4} sx={{ padding: 4, borderRadius: 3 }}>
              <Typography variant="h5" align="center" gutterBottom>
                Editar Empleado
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
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

                <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
                  <Button type="submit" variant="contained" color="primary">
                    Actualizar
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => navigate("/empleados")}>
                    Cancelar
                  </Button>
                </Box>
              </form>
            </Paper>
          </Container>
        </Box>
      ) : (
        <Box component="main" sx={styles.mainContent}>
          <Toolbar />
          <Typography variant="h4" color="error">Acceso denegado</Typography>
          <Typography>No tienes permiso para acceder a esta sección.</Typography>
        </Box>
      )}
    </Box>
  );
};

export default EditarEmpleado;