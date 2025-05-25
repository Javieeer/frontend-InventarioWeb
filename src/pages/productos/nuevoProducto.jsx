import { useState } from "react";
import {
  Toolbar,
  CssBaseline,
  Box,
  TextField,
  Button
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { styles } from "../../styles/dashboard";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { usarMensaje } from "../../context/mensaje";
import Saludo from "../../components/saludo";
import MenuLateral from "../../components/menuLateral";

const NuevoProducto = () => {

  /* Declaramos estados necesarios */
  const { userData } = useAuth();
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    precio_compra: "",
    cantidad: "",
    precio_venta: "",
    descripcion: "",
  });
  const { mostrarMensaje } = usarMensaje();
  const navigate = useNavigate();

  /* Definimos el rol para mostrar o no la db de empleados */
  const isAdmin = userData?.rol === "admin";

  /* Función para manejar el cambio de los campos de entrada de texto */
  const handleChange = (e) => {
    setNuevoProducto({
      ...nuevoProducto,
      [e.target.name]: e.target.value,
    });
  };

  /* Función para crear un nuevo empleado */
  const crearProducto = async () => {
    const { nombre, precio_compra, cantidad, precio_venta, descripcion } = nuevoProducto;

    // Validación de campos vacíos
    if ( !nombre || !precio_compra || !cantidad || !precio_venta || !descripcion ) {
      mostrarMensaje("Todos los campos son obligatorios", "error");
      return;
    }

    // Validar que los precios y cantidad solo contenga números
    const soloNumeros = /^\d+$/;
    if (!soloNumeros.test(precio_compra) || !soloNumeros.test(cantidad) || !soloNumeros.test(precio_venta)) {
      mostrarMensaje("El documento debe contener solo números.", "error");
      return;
    }

    // Si pasa todas las validaciones, insertar en Supabase
    const { data, error } = await supabase.from("productos").insert([
      {
        nombre: nuevoProducto.nombre,
        precio_compra: nuevoProducto.precio_compra,
        precio_venta: nuevoProducto.precio_venta,
        cantidad: nuevoProducto.cantidad,
        descripcion: nuevoProducto.descripcion,
      },
    ]);
    if (!error) {
      mostrarMensaje("Producto creado con éxito", "success");
      setTimeout(() => navigate("/productos"), 1500); 
    } else {
      mostrarMensaje("Error al crear el producto", "error");
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

      {/* Saludo */}
      <Saludo />

      {/* Menu lateral */}
      <MenuLateral rol = { isAdmin } />

      {isAdmin && (
        /* Contenido de la pagina */
        <Box component="main" sx={styles.mainContent}>
          <Toolbar />

          <Box component="main" sx={{ ...styles.mainContent, marginTop: '0' }}>
            <h1>Nuevo Producto</h1>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}>
              <TextField
                label="Nombre"
                name="nombre"
                value={nuevoProducto.nombre}
                onChange={handleChange}
              />
              <TextField
                label="Descripción"
                name="descripcion"
                value={nuevoProducto.descripcion}
                onChange={handleChange}
              />
              <TextField
                label="Precio de compra"
                name="precio_compra"
                value={nuevoProducto.precio_compra}
                onChange={handleChange}
              />
              <TextField
                label="Precio de venta"
                name="precio_venta"
                value={nuevoProducto.precio_venta}
                onChange={handleChange}
              />
              <TextField
                label="Cantidad"
                name="cantidad"
                value={nuevoProducto.cantidad}
                onChange={handleChange}
              />
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button variant="contained" onClick={crearProducto}>
                  Guardar
                </Button>
                <Button variant="outlined" onClick={cancelar}>
                  Cancelar
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      {/* Si no es admin, mostramos un mensaje */}
      {!isAdmin && (
        <Box component="main" sx={styles.mainContent}>
          <Toolbar />
          <h1>Acceso denegado</h1>
          <p>Solo los administradores pueden crear nuevos productos.</p>
          <Button variant="outlined" onClick={() => navigate("/productos")}>
            Volver a Productos
          </Button>
        </Box>
      )}  
    </Box>
  );
};

export default NuevoProducto;