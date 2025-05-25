import { Typography, CssBaseline, Box } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { styles } from "../../styles/dashboard"; // importa tus estilos como objeto
import Saludo from "../../components/saludo";
import MenuLateral from "../../components/menuLateral";


const Dashboard = () => {

  /* Definimos estados que vamos a usar */
  const { userData, logout } = useAuth();

  /* Definimos el rol para mostrar o no la db de empleados */
  const isAdmin = userData?.rol === "admin";

  return (
    /* Contenedor principal */
    <Box sx={styles.dashboardContainer}>
      <CssBaseline />

      {/* Saludo */}
      <Saludo />

      {/* Menu lateral */}
      <MenuLateral rol = { isAdmin } />

      {/* Contenido de la pagina */}
      <Box component="main" sx={styles.mainContent}>
        <Typography variant="h4" align="center" color="text.secondary">
          Seleccione una opción para continuar
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
