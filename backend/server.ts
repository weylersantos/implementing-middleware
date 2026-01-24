import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./auth.middleware";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // 5173 é o padrão do Vite

const SECRET_KEY = "ASD";

// ROTA DE LOGIN
app.post("/login", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  // Em um CRUD real, você validaria no banco aqui
  if (email === "dev@teste.com" && password === "123456") {
    const token = jwt.sign({ id: 1, role: "admin", email }, SECRET_KEY, {
      expiresIn: 15000,
    });

    // Enviando o token via Header Set-Cookie
    res.cookie("access_token", token, {
      httpOnly: true, // O JS do React NÃO consegue ler esse cookie (Segurança contra XSS)
      secure: process.env.NODE_ENV === "production", // Só envia via HTTPS em produção
      sameSite: "lax", // Proteção básica contra CSRF
      maxAge: 15000, // 1 hora
    });

    return res.json({ message: "Logado com sucesso!", user: { email } });
  }

  res.status(401).json({ message: "Credenciais inválidas" });
});

// ROTA PROTEGIDA (CRUD)
app.get("/perfil", authMiddleware, (req, res) => {
  res.json({ data: "Dados sensíveis do usuário", user: (req as any).user });
});

app.get("/me", authMiddleware, (req, res) => {
  res.json({ user: (req as any).user });
});

app.post("/logout", (req, res) => {
  // Sobrescrevemos o cookie com valor vazio e tempo de vida 0
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: true, // em produção
    sameSite: "lax",
  });

  return res.json({ message: "Logout realizado com sucesso" });
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
