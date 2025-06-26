import { useEffect, useState } from "react";
import {
    CssBaseline,
    Box,
    List,
    ListItem,
    ListItemText,
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

const LIMITE_STOCK = 12;

const Pedidos = () => {
    const { userData } = useAuth();
    const { mostrarMensaje } = usarMensaje();
    const [productosBajoStock, setProductosBajoStock] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isAdmin = userData?.rol === "admin";
    const navigate = useNavigate();

    useEffect(() => {
    const cargarProductos = async () => {
        const { data, error } = await supabase
        .from("productos")
        .select("nombre, cantidad")
        .lte("cantidad", LIMITE_STOCK);

        if (!error) setProductosBajoStock(data);
    };
    cargarProductos();
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

            {/* Contenido principal */}
            <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
                <Paper sx={{ p: 3, paddingTop: "64px" }}>
                    <Typography variant="h5" gutterBottom>
                    Productos con bajo stock
                    </Typography>
                    <List>
                    {productosBajoStock.length === 0 && (
                        <ListItem>
                        <ListItemText primary="No hay productos con bajo stock." />
                        </ListItem>
                    )}
                    {productosBajoStock.map((prod) => (
                        <ListItem key={prod.nombre}>
                        <ListItemText
                            primary={prod.nombre}
                            secondary={`Cantidad actual: ${prod.cantidad}`}
                        />
                        </ListItem>
                    ))}
                    </List>
                </Paper>
            </Box>
        </Box>
    );
};

export default Pedidos;