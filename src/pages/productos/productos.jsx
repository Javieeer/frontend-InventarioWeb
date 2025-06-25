import { useEffect, useState } from "react";
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
  IconButton,
  useMediaQuery,
  Stack,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../../context/authContext";
import { styles } from "../../styles/dashboard";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { usarMensaje } from "../../context/mensaje";
import Saludo from "../../components/saludo";
import MenuLateral from "../../components/menuLateral";

const Productos = () => {
  const { userData } = useAuth();
  const { mostrarMensaje } = usarMensaje();
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isAdmin = userData?.rol === "admin";

  const cargarProductos = async () => {
    const { data, error } = await supabase.from("productos").select("id, nombre, descripcion, precio_compra, cantidad, precio_venta, imagen_url");
    if (!error) setProductos(data);
  };

  const buscarProductos = () => {
    const filtrados = productos.filter(p =>
      Object.values(p).some(valor =>
        String(valor).toLowerCase().includes(busqueda.toLowerCase())
      )
    );
    setProductos(filtrados);
  };

  const limpiarBusqueda = () => {
    setBusqueda("");
    cargarProductos();
  };

  const handleEdit = (p) => {
    navigate(`/productos/editarProducto/${p.id}`, { state: { p } });
  }

  const eliminarProducto = async (id) => {
    const respuesta = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (!respuesta) return;
    const { error } = await supabase.from("productos").delete().eq("id", id);
    if (!error) {
      mostrarMensaje("Producto eliminado correctamente", "success");
      cargarProductos();
    } else {
      mostrarMensaje("Error al eliminar el producto", "error");
    }
  };

  const modificarCantidad = async (id, cantidadActual, cantidadMod, operacion) => {
    if (!cantidadMod || cantidadMod <= 0) {
      mostrarMensaje("Ingresa una cantidad válida", "warning");
      return;
    }

    let nuevaCantidad = operacion === "sumar"
      ? cantidadActual + cantidadMod
      : cantidadActual - cantidadMod;

    if (nuevaCantidad < 0) nuevaCantidad = 0;

    const { error } = await supabase
      .from('productos')
      .update({ cantidad: nuevaCantidad })
      .eq('id', id);

    if (!error) {
      mostrarMensaje("Cantidad actualizada", "success");
      cargarProductos();
    } else {
      mostrarMensaje("Error al actualizar cantidad", "error");
    }
  };

  useEffect(() => {
    cargarProductos();
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
        {/* Sección de busqueda */}
        <Box sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 2,
          mb: 2,
          justifyContent: isMobile ? 'stretch' : 'center',
          alignItems: isMobile ? 'stretch' : 'center',
          paddingTop: isMobile ? "64px" : 4,
        }}>
          <TextField
            label="Buscar Productos"
            variant="outlined"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            fullWidth={isMobile}
          />
          <Button variant="contained" onClick={buscarProductos} fullWidth={isMobile}>Buscar</Button>
          <Button variant="outlined" onClick={limpiarBusqueda} fullWidth={isMobile}>Limpiar</Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => navigate("/productos/nuevoProducto")}
            fullWidth={isMobile}
          >
            Crear Producto
          </Button>
        </Box>

        {/* Vista responsiva */}
        {isMobile ? (
          <Stack spacing={2}>
            {productos.map((p) => (
              <Paper
                key={p.id}
                sx={{
                  p: 2,
                  textAlign: 'left',
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              >
                <Typography variant="subtitle1"><b>Nombre:</b> {p.nombre}</Typography>
                <Typography variant="subtitle1"><b>Descripción:</b> {p.descripcion}</Typography>
                <Typography variant="subtitle1"><b>Stock:</b> {p.cantidad}</Typography>
                <Typography variant="subtitle1"><b>Precio venta:</b> {p.precio_venta}</Typography>
                {isAdmin && (
                  <Typography variant="subtitle1"><b>Precio compra:</b> {p.precio_compra}</Typography>
                )}
                <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                  <TextField
                    size="small"
                    type="number"
                    inputProps={{ min: 1 }}
                    value={p.cantidadTemporal || ""}
                    onChange={(e) => {
                      const valor = parseInt(e.target.value, 10) || "";
                      setProductos(prev =>
                        prev.map(prod =>
                          prod.id === p.id ? { ...prod, cantidadTemporal: valor } : prod
                        )
                      );
                    }}
                    sx={{ width: 80 }}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => modificarCantidad(p.id, p.cantidad, p.cantidadTemporal, "sumar")}
                  >
                    Agregar
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => modificarCantidad(p.id, p.cantidad, p.cantidadTemporal, "restar")}
                  >
                    Quitar
                  </Button>
                  <IconButton
                    onClick={() => handleEdit(p)}
                    sx={{ color: 'gray' }}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  {isAdmin && (
                    <IconButton
                      onClick={() => eliminarProducto(p.id)}
                      sx={{ color: 'gray' }}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              </Paper>
            ))}
          </Stack>
        ) : (
          // Tabla en escritorio
          <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto" }}>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>$ venta</TableCell>
                  {isAdmin && (
                    <TableCell>$ compra</TableCell>
                  )}
                  <TableCell>Actualizar cantidad</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productos.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.nombre}</TableCell>
                    <TableCell>{p.descripcion}</TableCell>
                    <TableCell>{p.cantidad}</TableCell>
                    <TableCell>{p.precio_venta}</TableCell>
                    {isAdmin && (
                      <TableCell>{p.precio_compra}</TableCell>
                    )}
                    <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'nowrap' }}>
                      <TextField
                        size="small"
                        type="number"
                        inputProps={{ min: 1 }}
                        value={p.cantidadTemporal || ""}
                        onChange={(e) => {
                          const valor = parseInt(e.target.value, 10) || "";
                          setProductos(prev =>
                            prev.map(prod =>
                              prod.id === p.id ? { ...prod, cantidadTemporal: valor } : prod
                            )
                          );
                        }}
                        sx={{ width: 80 }}
                      />
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => modificarCantidad(p.id, p.cantidad, p.cantidadTemporal, "sumar")}
                      >
                        Agregar
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => modificarCantidad(p.id, p.cantidad, p.cantidadTemporal, "restar")}
                      >
                        Quitar
                      </Button>
                      <IconButton
                        onClick={() => handleEdit(p)}
                        sx={{ color: 'gray' }}
                      >
                        <EditIcon />
                      </IconButton>
                      {isAdmin && (
                        <IconButton
                          onClick={() => eliminarProducto(p.id)}
                          sx={{ color: 'gray' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default Productos;