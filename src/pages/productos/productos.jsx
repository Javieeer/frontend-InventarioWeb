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

const Productos = () => {

  /* Declaramos estados necesarios para la ruta de productos */
  const { userData } = useAuth();
  const { mostrarMensaje } = usarMensaje();
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  /* Definimos el rol para mostrar o no la db de empleados en el menu lateral */
  const isAdmin = userData?.rol === "admin";

  /* Guardamos en productos los productos de la base de datos */
  const cargarProductos = async () => {
    const { data, error } = await supabase.from("productos").select("id, nombre, descripcion, precio_compra, cantidad, precio_venta, imagen_url");
    if (!error) setProductos(data);
  };

  /* Buscamos los productos que coincidan con la busqueda y actualizamos productos */
  const buscarProductos = () => {
    const filtrados = productos.filter(p =>
      Object.values(p).some(valor =>
        String(valor).toLowerCase().includes(busqueda.toLowerCase())
      )
    );
    setProductos(filtrados);
  };

  /* Limpiamos los resultados y volvemos a cargar todos los productos */
  const limpiarBusqueda = () => {
    setBusqueda("");
    cargarProductos();
  };

  /* Editamos el producto */
  const handleEdit = (p) => {
    console.log(p);
    console.log(p.id);
    navigate(`/productos/editarProducto/${p.id}`, { state: { p } });
  }

  /* Eliminamos el producto seleccionado */
  const eliminarProducto = async (id) => {
    const respuesta = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (!respuesta) return;
    if (respuesta) {
      const { error } = await supabase.from("productos").delete().eq("id", id);
      if (!error) {
        mostrarMensaje("Producto eliminado correctamente", "success");
        cargarProductos();
      } else {
        mostrarMensaje("Error al eliminar el producto", "error");
      }
    }
  };

  /* Modificamos la cantidad del producto */
  const modificarCantidad = async (id, cantidadActual, cantidadMod, operacion) => {
    if (!cantidadMod || cantidadMod <= 0) {
      mostrarMensaje("Ingresa una cantidad válida", "warning");
      return;
    }

    let nuevaCantidad = operacion === "sumar"
      ? cantidadActual + cantidadMod
      : cantidadActual - cantidadMod;

    if (nuevaCantidad < 0) nuevaCantidad = 0;

    console.log({ id, cantidadActual, cantidadMod, operacion, nuevaCantidad });

    const { error } = await supabase
      .from('productos')
      .update({ cantidad: nuevaCantidad })
      .eq('id', id);

    if (!error) {
      mostrarMensaje("Cantidad actualizada", "success");
      cargarProductos(); // recarga los datos
    } else {
      mostrarMensaje("Error al actualizar cantidad", "error");
    }
  };

  /* Tan pronto como se carga la pagina se cargan todos los productos */
  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    /* Container principal */
    <Box sx={styles.dashboardContainer}>
        <CssBaseline />

        {/* Saludo */}
        <Saludo />

        {/* Menu lateral */}
        <MenuLateral rol = { isAdmin } />

        {/* Contenido de la pagina */}
        <Box component="main" sx={styles.mainContent}>
            <Toolbar />

            {/* Sección de busqueda */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'center' }}>
                <TextField label="Buscar Productos" variant="outlined" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                <Button variant="contained" onClick={buscarProductos}>Buscar</Button>
                <Button variant="outlined" onClick={limpiarBusqueda}>Limpiar</Button>
                <Button variant="contained" color="success" onClick={() => navigate("/productos/nuevoProducto")}>Crear Producto</Button>
            </Box>

            {/* Tabla de productos */}
            <TableContainer component={Paper}>
            <Table>
              {/* Encabezados */}
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
              {/* Datos de la tabla por fila */}
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
                    <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {/* NUEVO BLOQUE: modificar cantidad */}
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
        </Box>
    </Box>
  );
};

export default Productos;