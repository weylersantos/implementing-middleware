# 🔐 Sistema de Autenticação com JWT e HttpOnly Cookies

> Projeto de estudo demonstrando uma implementação segura de autenticação utilizando JWT (JSON Web Token) armazenado em cookies HttpOnly, com backend em Node.js/Express e frontend em React.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura do Projeto](#-arquitetura-do-projeto)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Conceitos de Segurança](#-conceitos-de-segurança)
- [Fluxo de Autenticação](#-fluxo-de-autenticação)
- [Estrutura de Arquivos](#-estrutura-de-arquivos)
- [Detalhamento do Backend](#-detalhamento-do-backend)
- [Detalhamento do Frontend](#-detalhamento-do-frontend)
- [Como Executar](#-como-executar)
- [Endpoints da API](#-endpoints-da-api)
- [Testes Manuais](#-testes-manuais)
- [Considerações de Segurança](#-considerações-de-segurança)
- [Melhorias Futuras](#-melhorias-futuras)

---

## 🎯 Visão Geral

Este projeto implementa um sistema completo de autenticação seguindo boas práticas de segurança:

- **Autenticação via JWT** armazenado em cookie HttpOnly
- **Proteção contra XSS** (Cross-Site Scripting)
- **Proteção básica contra CSRF** (Cross-Site Request Forgery)
- **Rotas protegidas** no frontend com verificação de sessão
- **Interceptors** para redirecionamento automático em caso de sessão expirada

---

## 🏗 Arquitetura do Projeto

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│                    (React + Vite)                               │
│                    http://localhost:5173                        │
│                                                                 │
│  ┌───────────┐    ┌───────────┐    ┌──────────────────────┐     │
│  │  Login    │    │  Perfil   │    │   ProtectedRoute     │     │
│  │  Page     │    │  Page     │    │   (HOC de proteção)  │     │
│  └─────┬─────┘    └─────┬─────┘    └──────────┬───────────┘     │
│        │                │                     │                 │
│        └────────────────┴─────────────────────┘                 │
│                         │                                       │
│                  ┌──────┴──────┐                                │
│                  │   api.ts    │ ← Axios com withCredentials    │
│                  │ (Interceptor)│                               │
│                  └──────┬──────┘                                │
└─────────────────────────┼───────────────────────────────────────┘
                          │
                     HTTP + Cookies
                          │
┌─────────────────────────┼───────────────────────────────────────┐
│                         ▼                                       │
│                      BACKEND                                    │
│                  (Express + JWT)                                │
│                  http://localhost:3000                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    server.ts                            │    │
│  │  ┌─────────┐  ┌─────────┐  ┌────────┐  ┌───────────┐    │    │
│  │  │ /login  │  │ /logout │  │  /me   │  │  /perfil  │    │    │
│  │  │ (POST)  │  │ (POST)  │  │ (GET)  │  │  (GET)    │    │    │
│  │  └────┬────┘  └────┬────┘  └───┬────┘  └─────┬─────┘    │    │
│  │       │            │           │             │          │    │
│  │       │            │     ┌─────┴─────────────┘          │    │
│  │       │            │     ▼                              │    │
│  │       │            │  ┌──────────────────────────┐      │    │
│  │       │            │  │   auth.middleware.ts     │      │    │
│  │       │            │  │   (Validação do JWT)     │      │    │
│  │       │            │  └──────────────────────────┘      │    │
│  └───────┴────────────┴────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠 Tecnologias Utilizadas

### Backend

| Tecnologia        | Versão | Descrição                          |
| ----------------- | ------ | ---------------------------------- |
| **Express**       | 5.2.1  | Framework web para Node.js         |
| **jsonwebtoken**  | 9.0.3  | Implementação de JWT para Node.js  |
| **cookie-parser** | 1.4.7  | Middleware para parsing de cookies |
| **cors**          | 2.8.6  | Middleware para habilitar CORS     |
| **tsx**           | 4.21.0 | Executor de TypeScript             |
| **TypeScript**    | 5.9.3  | Superset tipado do JavaScript      |

### Frontend

| Tecnologia           | Versão | Descrição                         |
| -------------------- | ------ | --------------------------------- |
| **React**            | 19.2.0 | Biblioteca para construção de UIs |
| **react-router-dom** | 7.13.0 | Roteamento para React             |
| **axios**            | 1.13.2 | Cliente HTTP                      |
| **Vite**             | 7.2.4  | Build tool e dev server           |
| **TypeScript**       | 5.9.3  | Superset tipado do JavaScript     |

---

## 🔒 Conceitos de Segurança

### Por que usar Cookie HttpOnly em vez de LocalStorage?

| Aspecto                     | LocalStorage  | Cookie HttpOnly |
| --------------------------- | ------------- | --------------- |
| **Acesso via JavaScript**   | ✅ Sim        | ❌ Não          |
| **Vulnerável a XSS**        | ⚠️ Alto risco | ✅ Protegido    |
| **Enviado automaticamente** | ❌ Não        | ✅ Sim          |
| **Controle de expiração**   | Manual        | Automático      |

### Flags do Cookie Explicadas

```typescript
res.cookie("access_token", token, {
  httpOnly: true, // JavaScript NÃO consegue acessar (proteção XSS)
  secure: true, // Só envia via HTTPS (produção)
  sameSite: "lax", // Proteção básica contra CSRF
  maxAge: 15000, // Tempo de vida em milissegundos
});
```

#### Detalhamento das Flags:

| Flag       | Valor            | Propósito                                                                                      |
| ---------- | ---------------- | ---------------------------------------------------------------------------------------------- |
| `httpOnly` | `true`           | Impede acesso via `document.cookie` no JavaScript. Proteção contra ataques XSS.                |
| `secure`   | `true` (em prod) | Cookie só é enviado em conexões HTTPS. Proteção contra man-in-the-middle.                      |
| `sameSite` | `"lax"`          | Previne que o cookie seja enviado em requisições cross-site (exceto navegação). Proteção CSRF. |
| `maxAge`   | `15000`          | Tempo de vida do cookie em ms. Após expirar, o browser descarta automaticamente.               |

### Valores possíveis para `sameSite`:

- **`strict`**: Cookie NUNCA é enviado em requisições cross-site
- **`lax`**: Cookie é enviado em navegação top-level (links), mas não em POST cross-site
- **`none`**: Cookie sempre enviado (requer `secure: true`)

---

## 🔄 Fluxo de Autenticação

### 1. Login (Sucesso)

```
┌──────────┐                              ┌──────────┐
│  Client  │                              │  Server  │
└────┬─────┘                              └────┬─────┘
     │                                         │
     │  POST /login                            │
     │  { email, password }                    │
     │────────────────────────────────────────►│
     │                                         │
     │                          Valida credenciais
     │                          Gera JWT token
     │                                         │
     │  200 OK                                 │
     │  Set-Cookie: access_token=xxx          │
     │  { message, user }                      │
     │◄────────────────────────────────────────│
     │                                         │
     │  Browser salva cookie automaticamente   │
     │                                         │
```

### 2. Acessando Rota Protegida

```
┌──────────┐                              ┌──────────┐
│  Client  │                              │  Server  │
└────┬─────┘                              └────┬─────┘
     │                                         │
     │  GET /perfil                            │
     │  Cookie: access_token=xxx               │
     │────────────────────────────────────────►│
     │                                         │
     │                    Middleware intercepta
     │                    Extrai token do cookie
     │                    Verifica JWT
     │                    Adiciona user ao req
     │                                         │
     │  200 OK                                 │
     │  { data, user }                         │
     │◄────────────────────────────────────────│
     │                                         │
```

### 3. Token Inválido/Expirado

```
┌──────────┐                              ┌──────────┐
│  Client  │                              │  Server  │
└────┬─────┘                              └────┬─────┘
     │                                         │
     │  GET /perfil                            │
     │  Cookie: access_token=expired_token     │
     │────────────────────────────────────────►│
     │                                         │
     │                    jwt.verify() falha
     │                                         │
     │  403 Forbidden                          │
     │  { message: "Token inválido" }          │
     │◄────────────────────────────────────────│
     │                                         │
     │  Interceptor redireciona para /login    │
     │                                         │
```

### 4. Logout

```
┌──────────┐                              ┌──────────┐
│  Client  │                              │  Server  │
└────┬─────┘                              └────┬─────┘
     │                                         │
     │  POST /logout                           │
     │────────────────────────────────────────►│
     │                                         │
     │                    res.clearCookie()
     │                                         │
     │  200 OK                                 │
     │  Set-Cookie: access_token=; Max-Age=0  │
     │◄────────────────────────────────────────│
     │                                         │
     │  Browser remove o cookie                │
     │                                         │
```

---

## 📁 Estrutura de Arquivos

```
autenticacao/
├── backend/
│   ├── server.ts           # Servidor Express + rotas
│   ├── auth.middleware.ts  # Middleware de autenticação JWT
│   ├── package.json        # Dependências do backend
│   └── node_modules/
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx           # Entry point + configuração de rotas
│   │   ├── api.ts             # Configuração do Axios + Interceptors
│   │   ├── Login.tsx          # Página de login
│   │   ├── Perfil.tsx         # Página protegida do perfil
│   │   └── ProtectedRoute.tsx # HOC para proteção de rotas
│   │
│   ├── index.html          # HTML base
│   ├── package.json        # Dependências do frontend
│   ├── vite.config.ts      # Configuração do Vite
│   └── node_modules/
│
└── README.MD               # Este arquivo
```

---

## 🖥 Detalhamento do Backend

### `server.ts` - Servidor Principal

```typescript
// Middlewares essenciais
app.use(express.json()); // Parse de JSON no body
app.use(cookieParser()); // Parse de cookies
app.use(
  cors({
    origin: "http://localhost:5173", // Origem permitida (Vite)
    credentials: true, // CRUCIAL: permite envio de cookies
  }),
);
```

#### Rota POST `/login`

- Recebe `email` e `password` no body
- Valida credenciais (hardcoded para estudo: `dev@teste.com` / `123456`)
- Gera token JWT com payload `{ id, role, email }`
- Retorna cookie HttpOnly com o token

#### Rota GET `/me`

- **Protegida** pelo `authMiddleware`
- Retorna dados do usuário decodificados do JWT
- Útil para verificar se a sessão está válida

#### Rota GET `/perfil`

- **Protegida** pelo `authMiddleware`
- Simula retorno de dados sensíveis do usuário

#### Rota POST `/logout`

- Limpa o cookie usando `res.clearCookie()`
- O browser remove o cookie automaticamente

### `auth.middleware.ts` - Middleware de Autenticação

```typescript
export const authMiddleware = (req, res, next) => {
  // 1. Extrai token do cookie (NÃO do header Authorization)
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  try {
    // 2. Verifica e decodifica o JWT
    const decoded = jwt.verify(token, SECRET_KEY);

    // 3. Anexa dados do usuário na requisição
    (req as any).user = decoded;

    // 4. Permite continuar para a rota
    next();
  } catch (err) {
    // Token inválido ou expirado
    return res.status(403).json({ message: "Token inválido ou expirado" });
  }
};
```

---

## ⚛️ Detalhamento do Frontend

### `api.ts` - Configuração do Axios

```typescript
export const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // 🔑 ESSENCIAL: permite envio/recebimento de cookies
});

// Interceptor para tratar erros de autenticação globalmente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      // Redireciona automaticamente para login se não autorizado
      window.location.href = "/login";
    }
  },
);
```

> ⚠️ **IMPORTANTE**: O `withCredentials: true` é obrigatório para que o Axios envie e receba cookies cross-origin.

### `Login.tsx` - Página de Login

```typescript
const handleLogin = async () => {
  try {
    // 1. Faz POST para /login
    await api.post("/login", { email, password });

    // 2. Se sucesso, o browser já recebeu e salvou o cookie
    //    (via header Set-Cookie da resposta)

    // 3. Navega para página protegida
    navigate("/perfil");
  } catch (err) {
    alert("Erro no login");
  }
};
```

### `ProtectedRoute.tsx` - HOC de Proteção

```typescript
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    // Verifica autenticação chamando rota protegida
    api.get("/me")
      .then(() => setIsAuth(true))   // Token válido
      .catch(() => setIsAuth(false)); // Token inválido
  }, []);

  // Estado de carregamento
  if (isAuth === null) return <div>Carregando...</div>;

  // Renderiza children ou redireciona
  return isAuth ? children : <Navigate to="/login" replace />;
}
```

### `main.tsx` - Configuração de Rotas

```typescript
<BrowserRouter>
  <Routes>
    {/* Rotas públicas */}
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Login />} />

    {/* Rotas protegidas - envolvidas pelo ProtectedRoute */}
    <Route
      path="/perfil"
      element={
        <ProtectedRoute>
          <Perfil />
        </ProtectedRoute>
      }
    />
  </Routes>
</BrowserRouter>
```

### `Perfil.tsx` - Página Protegida

```typescript
export function Perfil() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Busca dados do usuário ao montar
    api
      .get("/me")
      .then((response) => setUser(response.data.user))
      .catch(() => navigate("/login"));
  }, []);

  const handleLogout = async () => {
    await api.post("/logout"); // Limpa cookie no servidor
    navigate("/login"); // Redireciona
  };

  // ... render
}
```

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

### 1. Clonar/Acessar o Projeto

```bash
cd autenticacao
```

### 2. Instalar Dependências

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

### 3. Executar

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
# Servidor rodando em http://localhost:3000
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
# App rodando em http://localhost:5173
```

### 4. Testar

- Acesse `http://localhost:5173`
- Faça login com:
  - **Email:** `dev@teste.com`
  - **Senha:** `123456`

---

## 📡 Endpoints da API

| Método | Endpoint  | Protegida | Descrição                          |
| ------ | --------- | --------- | ---------------------------------- |
| `POST` | `/login`  | ❌        | Autentica usuário e retorna cookie |
| `POST` | `/logout` | ❌        | Remove cookie de autenticação      |
| `GET`  | `/me`     | ✅        | Retorna dados do usuário logado    |
| `GET`  | `/perfil` | ✅        | Retorna dados sensíveis do usuário |

### Exemplos de Request/Response

#### POST /login

```bash
# Request
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@teste.com","password":"123456"}'

# Response (200)
{
  "message": "Logado com sucesso!",
  "user": { "email": "dev@teste.com" }
}
# + Header: Set-Cookie: access_token=eyJhbGc...; HttpOnly; Path=/
```

#### GET /me (autenticado)

```bash
# Request (o cookie é enviado automaticamente pelo browser)
curl http://localhost:3000/me \
  --cookie "access_token=eyJhbGc..."

# Response (200)
{
  "user": {
    "id": 1,
    "role": "admin",
    "email": "dev@teste.com",
    "iat": 1234567890,
    "exp": 1234582890
  }
}
```

#### GET /me (não autenticado)

```bash
# Response (401)
{
  "message": "Token não fornecido"
}
```

---

## 🧪 Testes Manuais

### Verificando o Cookie no Browser

1. Abra as **DevTools** (F12)
2. Vá para a aba **Application** (Chrome) ou **Storage** (Firefox)
3. Em **Cookies**, selecione `http://localhost:5173`
4. Você verá o cookie `access_token` após login

> 💡 **Nota:** O valor do cookie estará visível aqui, mas `document.cookie` no console retornará vazio devido ao `httpOnly`.

### Testando a Proteção HttpOnly

```javascript
// No console do browser, após fazer login:
console.log(document.cookie);
// Resultado: "" (vazio - cookie não acessível via JS)
```

### Testando Expiração

O token está configurado para expirar em **15 segundos** (`expiresIn: 15000`). Aguarde esse tempo e tente acessar `/perfil` - você será redirecionado.

---

## ⚠️ Considerações de Segurança

### ✅ O que este projeto implementa:

- Cookie HttpOnly (proteção XSS)
- Flag `sameSite: lax` (proteção CSRF básica)
- Flag `secure` em produção (HTTPS obrigatório)
- Validação de token via middleware

### ⚠️ O que NÃO está implementado (necessário em produção):

1. **Refresh Token**: Sistema de renovação de tokens para não forçar re-login
2. **HTTPS**: Obrigatório em produção para `secure: true`
3. **Banco de dados**: Credenciais estão hardcoded
4. **Rate limiting**: Proteção contra brute force
5. **Senha hasheada**: Usar bcrypt em produção
6. **CSRF Token**: Para proteção completa contra CSRF
7. **Variáveis de ambiente**: SECRET_KEY está hardcoded
8. **Logs de auditoria**: Registro de tentativas de login

### Exemplo de SECRET_KEY em produção:

```typescript
// ❌ NÃO FAZER (atual no projeto)
const SECRET_KEY = "ASD";

// ✅ FAZER em produção
const SECRET_KEY = process.env.JWT_SECRET; // Via .env
```

---

> 💡 **Dica:** Use este projeto como base para entender os conceitos. Em produção, considere usar bibliotecas especializadas como `passport.js`, `next-auth`, ou serviços como Auth0/Firebase Auth.
