import React, { useState, useContext } from "react";
import { TextField, Button, Container, Box, Typography, CircularProgress } from "@mui/material";
import { login } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Импортируем контекст

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);  // Для отслеживания состояния загрузки
  const [error, setError] = useState("");  // Для ошибок логина
  const navigate = useNavigate();
  const { login: setAuthLogin } = useContext(AuthContext); // Используем контекст для логина

  const handleLogin = async () => {
    setLoading(true);
    setError(""); // Сбросим ошибку при новом запросе

    try {
      const data = await login(username, password);  // Здесь должен быть ваш API запрос
      if (data.token) {
        localStorage.setItem("token", data.token);
        setAuthLogin(data.token);  // Обновляем состояние в контексте
        navigate("/dashboard");
      } else {
        setError("Login failed, please check your credentials.");
      }
    } catch (error) {
      setError("An error occurred, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)", // Высота экрана минус высота Navbar
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f6f8",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: 3,
          padding: 4,
          borderRadius: 2,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <Box width="100%" component="form" noValidate>
          <TextField
            label="Username"
            fullWidth
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ marginBottom: 2 }}
            disabled={loading}
          />
          <TextField
            label="Password"
            fullWidth
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: 2 }}
            disabled={loading}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            sx={{ marginBottom: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>

          {error && (
            <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
        <Typography variant="body2">
          Don't have an account?{" "}
          <Link to="/sign-up" style={{ textDecoration: "none" }}>
            Sign Up
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Login;
