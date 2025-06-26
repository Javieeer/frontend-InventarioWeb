import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { Toolbar, Drawer, List, ListItemText, Box, Divider, ListItemIcon, ListItemButton, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { styles } from "../styles/dashboard";
import Saludo from "./saludo";

const MenuLateral = ({ rol, mobileOpen, setMobileOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = async () => {
    await logout();
  };

  const isAdmin = rol;

  // Drawer content
  const drawerContent = (
    <Box sx={{ overflow: "auto" }}>
      <List>
        {isAdmin && (
          <ListItemButton onClick={() => navigate("/empleados")}>
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary="Base de datos empleados" />
          </ListItemButton>
        )}
        <ListItemButton onClick={() => navigate("/productos")}>
          <ListItemIcon><InventoryIcon /></ListItemIcon>
          <ListItemText primary="Base de datos productos" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/pedidos")}>
          <ListItemIcon><InventoryIcon /></ListItemIcon>
          <ListItemText primary="Articulos a pedir" />
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
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? mobileOpen : true}
      onClose={() => setMobileOpen(false)}
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: styles.drawerPaper,
      }}
    >
      <Toolbar />
      {drawerContent}
    </Drawer>
  );
};

export default MenuLateral;