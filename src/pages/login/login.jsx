// src/pages/Login.jsx
import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  InputAdornment,
} from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext.jsx";
import {
  containerStyle,
  boxStyle,
  lockIconStyle,
  buttonStyle,
} from "../../styles/login.js";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [emailFocused, setEmailFocused] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setEmailError(false);
    setPasswordError(false);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      const msg = error.message.toLowerCase();
      //console.log("Error de login:", error.message);
      if (msg.includes("invalid login credentials") && email.length > 0) {
        // Podrías asumir primero que es usuario no registrado
        setEmailError(true);
        setError("El usuario no existe, verifique sus credenciales.");
      } else if (msg.includes("password") || msg.includes("wrong password")) {
        setPasswordError(true);
        setError("La contraseña es incorrecta, verifique sus credenciales.");
      } else {
        setError("Error al iniciar sesión: " + error.message);
      }
      
    }
  };

  const handleFocusEmail = () => {
    setEmailFocused(true);
    if (email === "Erley_admin") {
      setEmail("");
    }
  };

  const handleBlurEmail = () => {
    setEmailFocused(false);
  };

  return (
    <Container component="main" maxWidth="xs" sx={containerStyle}>
      <Box sx={boxStyle}>
        <LockIcon sx={lockIconStyle} />

        <Typography variant="h5" gutterBottom>
          Bienvenido al sistema de la Salsamentaria Bedoya
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Ingrese con sus credenciales por favor
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            label="Correo electrónico"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={handleFocusEmail}
            onBlur={handleBlurEmail}
            required
            placeholder={!emailFocused ? "Erley_admin" : ""}
            autoComplete="email"
            error={emailError}
            helperText={emailError ? "Este usuario no está registrado." : ""}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            error={passwordError}
            helperText={passwordError ? "Contraseña incorrecta." : ""}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />

          <Button type="submit" variant="contained" fullWidth sx={buttonStyle}>
            Iniciar sesión
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
