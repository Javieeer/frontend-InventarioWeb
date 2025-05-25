import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { Toolbar, Drawer, List, ListItemText, Box, Divider, ListItemIcon, ListItemButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles/dashboard"; 

const MenuLateral = ( { rol } ) => {

    const { logout } = useAuth();
    const navigate = useNavigate();

    /* Cerramos sesión */
    const handleLogout = async () => {
        await logout();
    };

    const isAdmin = rol

    return (
        /* Menu lateral */
        <Drawer
            variant="permanent"
            sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: styles.drawerPaper,
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: "auto" }}>
            <List>
                {isAdmin && (
                <ListItemButton onClick={() => navigate("/empleados")}>
                    <ListItemIcon><PeopleIcon /></ListItemIcon>
                    <ListItemText primary="Base de datos empleados"/>
                </ListItemButton>                
                )}
                <ListItemButton onClick={() => navigate("/productos")}>
                    <ListItemIcon><InventoryIcon /></ListItemIcon>
                    <ListItemText primary="Base de datos productos" />
                </ListItemButton>
                <ListItemButton onClick={() => navigate("/configPerfil")}>
                    <ListItemIcon><SettingsIcon /></ListItemIcon>
                    <ListItemText primary="Configuración de perfil" />
                </ListItemButton>
                <Divider />
                <ListItemButton onClick={handleLogout}>
                    <ListItemIcon><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Cerrar sesión" />
                </ListItemButton>
            </List>
            </Box>
        </Drawer>
    )
}

export default MenuLateral;