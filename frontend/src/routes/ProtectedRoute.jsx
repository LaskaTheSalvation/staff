import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
  return localStorage.getItem("isStaffLoggedIn") === "true";
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login/staff" replace />;
  }
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
