import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button } from "@mui/material";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Выход
    navigate("/login"); // Перенаправление на страницу логина
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/dashboard">
          Dashboard
        </Button>
        <Button color="inherit" component={Link} to="/vocabulary">
          Vocabulary
        </Button>
        <Button color="inherit" component={Link} to="/profile">
          Profile
        </Button>

        {isLoggedIn ? (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/sign-up">
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
