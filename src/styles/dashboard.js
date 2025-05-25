const drawerWidth = 240;

export const styles = {
  dashboardContainer: {
    display: "flex",
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    ml: `${drawerWidth}px`,
  },
  drawerPaper: {
    width: drawerWidth,
    boxSizing: "border-box",
  },
  mainContent: {
    flexGrow: 1,
    p: 3,
    mt: 8, // equivalente a 64px para compensar el AppBar
  },
};
