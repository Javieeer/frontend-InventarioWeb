import { Typography, CssBaseline, Box, IconButton, useMediaQuery, AppBar, Toolbar } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { styles } from "../../styles/dashboard";
import Saludo from "../../components/saludo";
import MenuLateral from "../../components/menuLateral";

const Dashboard = () => {
  const { userData } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isAdmin = userData?.rol === "admin";

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
        <Typography variant="h4" align="center" color="text.secondary" paddingTop={"64px"}>
          Seleccione una opción para continuar
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;