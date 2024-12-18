import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Vocabulary from "./pages/Vocabulary";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { AuthContext } from "./context/AuthContext"; // Импортируем контекст

const App = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Перенаправляем на Dashboard, если авторизован */}
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/login"
          element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route path="/sign-up" element={<SignUp />} />

        {/* Защищенные маршруты */}
        <Route
          path="/profile"
          element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/vocabulary"
          element={isLoggedIn ? <Vocabulary /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
