import React from "react";
import { Navigate } from "react-router-dom";

export function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export function RequireAdmin({ children }) {
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toLowerCase();
  if (!token) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/wallet" replace />;
  return children;
}
