// ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "./api";
import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps ) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    // Verifica se o usuário é válido ao carregar a rota
    api.get("/me")
      .then(() => setIsAuth(true))
      .catch(() => setIsAuth(false));
  }, []);

  if (isAuth === null) return <div>Carregando...</div>;

  return isAuth ? children : <Navigate to="/login" replace />;
}