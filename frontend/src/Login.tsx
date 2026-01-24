import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "./api";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      // O servidor vai responder com o header 'Set-Cookie'
      // O browser vai salvar esse cookie sozinho
      await api.post("/login", { email, password });
      navigate("/perfil");
      alert("Logado!");
    } catch (err) {
      alert("Erro no login");
    }
  };

  // const handleLogout = async () => {
  //   try {
  //     // O servidor vai responder com o header 'Set-Cookie'
  //     // O browser vai salvar esse cookie sozinho
  //     await api.post("/logout");
  //     alert("Deslogado!");
  //   } catch (err) {
  //     alert("Erro no logout");
  //   }
  // };

  // const checkProfile = async () => {
  //   try {
  //     // O Axios enviará o cookie automaticamente graças ao withCredentials: true
  //     const response = await api.get("/perfil");
  //     console.log(response.data);
  //   } catch (err) {
  //     console.error("Não autorizado");
  //   }
  // };

  return (
    <div>
      <input type="email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Logar</button>
      {/* <button onClick={checkProfile}>Ver Dados Protegidos</button> */}
      {/* <button onClick={handleLogout}>Logout</button> */}
    </div>
  );
}
