import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Belum login → redirect ke login
    return <Navigate to="/login" replace />;
  }

  // Sudah login → render halaman
  return children;
}

export default PrivateRoute;