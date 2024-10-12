import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import ProgressPage from "./components/ProgressPage";
import { Provider } from "react-redux";
import store from "./redux/store"; 
import { ThemeProvider } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import HomePage from './components/HomePage';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        {/* <CssBaseline /> */}
        <Router>
          <AppBar position="sticky">
            <Toolbar>
              <Typography component={Link} to="/home" variant="h5" sx={{ flexGrow: 1, color: "white", textDecorationLine: 'none' }}>
                Project Management
              </Typography>
              <Button component={Link} to="/" color="inherit" sx={{  borderRadius: "8px", padding: "10px 20px", color: "white" }}>
                Progress Page
              </Button>
              {isLoggedIn ? (
                <>
                  <Button component={Link} to="/admin" color="inherit" sx={{  borderRadius: "8px", padding: "10px 20px", color: "white" }}>
                    Admin Panel
                  </Button>
                  <Button onClick={handleLogout} color="inherit" sx={{  borderRadius: "8px", padding: "10px 20px", color: "white" }}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button component={Link} to="/admin-login" color="inherit" sx={{  borderRadius: "8px", padding: "10px 20px", color: "white" }}>
                  Admin Login
                </Button>
              )}
            </Toolbar>
          </AppBar>
          <Routes>
            <Route path="/" element={<ProgressPage isAdmin={isLoggedIn} />} />
            <Route path="/home" element={<HomePage isAdmin={isLoggedIn} />} />
            <Route path="/admin" element={isLoggedIn ? <AdminPanel onLogout={handleLogout} /> : <Navigate to="/admin-login" />} />
            <Route path="/admin-login" element={<Login onLogin={handleLogin} />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
