import { AppBar, Toolbar, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles/saludo";

const Saludo = () => {

    const { userData } = useAuth();

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
    
    return (
        <AppBar position="fixed" sx={styles.appBar}>
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    {getGreeting()}, {userName} {userLastName}
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default Saludo;