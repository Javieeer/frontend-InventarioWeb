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
  CssBaseline
} from "@mui/material";
import { supabase } from "../../../supabaseClient";
import { useAuth } from "../../context/AuthContext";
import Saludo from "../../components/saludo";
import MenuLateral from "../../components/menuLateral";
import { styles } from "../../styles/dashboard";

const EditarProducto = () => {
  
  /* Definimos estados que vamos a usar */
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const isAdmin = userData?.rol === "admin";
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio_compra: "",
    precio_venta: "",
  });

  /* Cargamos el producto desde la base de datos y lo guardamos en el estado */
  useEffect(() => {
    const fetchProducto = async () => {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error al cargar producto:", error);
        navigate("/productos");
      } else {
        setProducto(data);
      }
    };

    fetchProducto();
  }, [id, navigate]);

  /* Hacemos el update a la cantidad en la base de datos */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const camposPermitidos = {
      ...(isAdmin && {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio_compra: producto.precio_compra,
        precio_venta: producto.precio_venta
      })
    };

    const { error } = await supabase
      .from("productos")
      .update(camposPermitidos)
      .eq("id", id);

    if (error) {
      console.error("Error al actualizar producto:", error);
    } else {
      navigate("/productos");
    }
  };

  return (

    /* Container principal */
    <Box sx={styles.dashboardContainer}>
      <CssBaseline />
      
      {/* Saludo */}
      <Saludo />

      {/* Menu lateral */}
      <MenuLateral rol={isAdmin} />

      {/* Contenido de la pagina */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh"
        }}
      >
      {isAdmin && (
        <Container maxWidth="sm">
          <Paper elevation={4} sx={{ padding: 4, borderRadius: 3 }}>

            {/* Titulo */}
            <Typography variant="h5" align="center" gutterBottom>
              Editar Producto
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Nombre"
                    value={producto.nombre}
                    onChange={(e) =>
                      setProducto({ ...producto, nombre: e.target.value })
                    }
                    fullWidth
                    required
                    disabled={!isAdmin}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Descripción"
                    value={producto.descripcion}
                    onChange={(e) =>
                      setProducto({
                        ...producto,
                        descripcion: e.target.value
                      })
                    }
                    fullWidth
                    disabled={!isAdmin}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Precio de compra"
                    type="number"
                    value={producto.precio_compra}
                    onChange={(e) =>
                      setProducto({
                        ...producto,
                        precio_compra: e.target.value
                      })
                    }
                    fullWidth
                    disabled={!isAdmin}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Precio de venta"
                    type="number"
                    value={producto.precio_venta}
                    onChange={(e) =>
                      setProducto({
                        ...producto,
                        precio_venta: e.target.value
                      })
                    }
                    fullWidth
                    disabled={!isAdmin}
                  />
                </Grid>
              </Grid>

              <Box
                sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}
              >
                <Button type="submit" variant="contained" color="primary" disabled={!isAdmin}>
                  Actualizar
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate("/productos")}
                >
                  Cancelar
                </Button>
              </Box>
            </form>
          </Paper>
        </Container>
      )}
      {/* Si no es admin, mostramos un mensaje de error */}
      {!isAdmin && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            maxWidth: 400,
            marginTop: 4
          }}
        >
          <Typography variant="h5" color="error">
            Acceso denegado
          </Typography>
          <Typography variant="body1">
            Solo los administradores pueden editar productos.
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/productos")}
          >
            Volver
          </Button>
        </Box>
      )}
      </Box>
    </Box>
  );
};

export default EditarProducto;
