import { AppBar, Toolbar, Typography, Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../context/authContext";
import { styles } from "../styles/saludo";

const Saludo = ({ simple = false }) => {
    const { userData } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const userName = userData?.nombre || "Usuario";
    const userLastName = userData?.apellido || "";

    const getGreeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) {
            return "Buenos días";
        } else if (currentHour < 18) {
            return "Buenas tardes";
        } else {
            return "Buenas noches";
        }
    };

    // Si simple o móvil, solo muestra el texto
    if (simple || isMobile) {
        return (
            <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="subtitle1">
                    {getGreeting()}, {userName} {userLastName}
                </Typography>
            </Box>
        );
    }

    // Si escritorio, muestra el AppBar
    return (
        <AppBar position="fixed" sx={styles.appBar}>
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    {getGreeting()}, {userName} {userLastName}
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Saludo;