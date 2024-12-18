import React, { useState, useContext } from "react";
import { TextField, Button, Container, Box, Typography, CircularProgress } from "@mui/material";
import { signup } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Импортируем контекст

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);  // Для отслеживания состояния загрузки
  const [error, setError] = useState("");  // Для ошибок регистрации
  const navigate = useNavigate();
  const { login: setAuthLogin } = useContext(AuthContext); // Используем контекст для логина

  const handleSignUp = async () => {
    setLoading(true);
    setError(""); // Сбросим ошибку при новом запросе

    try {
      const data = await signup(username, password);  // Здесь должен быть ваш API запрос
      if (data.token) {
        localStorage.setItem("token", data.token);  // Сохраняем токен в localStorage
        setAuthLogin(data.token);  // Обновляем состояние в контексте
        navigate("/dashboard");
      } else {
        setError("Sign-up failed, please check your credentials.");
      }
    } catch (error) {
      setError("An error occurred during sign-up.");
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
          Sign Up
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
            onClick={handleSignUp}
            sx={{ marginBottom: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
          </Button>

          {error && (
            <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
        <Typography variant="body2">
          Already have an account?{" "}
          <Link to="/login" style={{ textDecoration: "none" }}>
            Login
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default SignUp;
