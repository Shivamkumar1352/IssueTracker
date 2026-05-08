import React from "react";
import { Navigate } from "react-router-dom";
import { getUserRole, getValidToken } from "../../utils/auth";

const AdminRoute = ({ children }) => {
  const token = getValidToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (getUserRole() === "admin") {
    return children;
  }

  return <Navigate to="/login" replace />;
};

export default AdminRoute;
