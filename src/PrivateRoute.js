import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const isAuthenticated = !!localStorage.getItem("token"); // Проверка токена

  return isAuthenticated ? (
    <Outlet /> // Если пользователь авторизован, отображаем вложенные маршруты
  ) : (
    <Navigate to="/login" replace /> // Если нет, перенаправляем на страницу логина
  );
};

export default PrivateRoute;
