// Perfil.tsx
import { useEffect, useState } from "react";
import { api } from "./api";
import { useNavigate } from "react-router-dom";

export function Perfil() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/me")
      .then((response) => {
        // O backend retorna { user: { id: 1, role: 'admin' } }
        // Note: como seu backend de teste não envia o email no JWT,
        // ele pode vir undefined se não ajustar o jwt.sign no login.
        setUser(response.data.user);
      })
      .catch(() => {
        // O interceptor já cuida do redirect, mas é bom ter um fallback
        navigate("/login");
      });
  }, []);

  const handleLogout = async () => {
    await api.post("/logout");
    navigate("/login");
  };

  if (!user) return <p>Carregando...</p>;

  return (
    <div>
      <header style={{ padding: "1rem", background: "#eee" }}>
        <h1>Bem-vindo!</h1>
        <p>
          Logado como: <strong>{user.email || "Usuário Teste"}</strong>
        </p>
        <button onClick={handleLogout}>Sair</button>
      </header>
      <main>
        <p>Este é o conteúdo protegido do seu perfil.</p>
      </main>
    </div>
  );
}
