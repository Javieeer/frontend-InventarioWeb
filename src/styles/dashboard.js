const drawerWidth = 240;

export const styles = {
  dashboardContainer: {
    display: "flex",
    minHeight: "100vh",
    // Media query para pantallas pequeñas
    '@media (max-width:600px)': {
      flexDirection: "column",
    },
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    ml: `${drawerWidth}px`,
    '@media (max-width:600px)': {
      width: "100%",
      ml: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
    boxSizing: "border-box",
    '@media (max-width:600px)': {
      width: "100%",
      position: "relative",
      height: "auto",
    },
  },
  mainContent: {
    flexGrow: 1,
    p: 3,
    mt: 8, // equivalente a 64px para compensar el AppBar
    '@media (max-width:600px)': {
      p: 1,
      mt: 2,
    },
  },
};