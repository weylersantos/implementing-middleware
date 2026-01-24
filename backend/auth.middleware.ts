import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = "ASD";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Pegando o token do Cookie (mais seguro que LocalStorage)
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    // Adiciona os dados do usuário na requisição para as rotas seguintes
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido ou expirado" });
  }
};
