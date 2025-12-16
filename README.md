# 🎬 API de Gerenciamento de Filmes e Watchlist

Uma API REST desenvolvida em Node.js com Express para gerenciar filmes e listas de observação (watchlist) de usuários, incluindo sistema completo de autenticação com JWT.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Endpoints da API](#endpoints-da-api)
- [Modelos de Dados](#modelos-de-dados)
- [Executando o Projeto](#executando-o-projeto)
- [Scripts Disponíveis](#scripts-disponíveis)

## 🎯 Sobre o Projeto

Esta API permite que usuários:
- Criem contas e façam login/logout
- Gerenciem filmes (CRUD completo)
- Criem e gerenciem suas listas de observação pessoais
- Adicionem filmes à watchlist com status, avaliações e notas
- Acompanhem o progresso de assistir filmes

## 🛠 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Prisma** - ORM para gerenciamento de banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT (jsonwebtoken)** - Autenticação baseada em tokens
- **bcryptjs** - Criptografia de senhas
- **dotenv** - Gerenciamento de variáveis de ambiente
- **nodemon** - Desenvolvimento com hot-reload

## 📦 Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [PostgreSQL](https://www.postgresql.org/) (versão 12 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/middlewares.git
cd middlewares
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (veja a seção [Configuração](#configuração))

4. Execute as migrações do Prisma:
```bash
npx prisma migrate dev
```

5. (Opcional) Popule o banco de dados com dados de exemplo:
```bash
npm run seed:movies
```

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto baseado no arquivo `env.example`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
NODE_ENV="development"
JWT_SECRET="seu_secret_jwt_super_seguro_aqui"
JWT_EXPIRES_IN="7d"
```

### Variáveis de Ambiente

- `DATABASE_URL`: String de conexão com o PostgreSQL
- `NODE_ENV`: Ambiente de execução (`development` ou `production`)
- `JWT_SECRET`: Chave secreta para assinatura dos tokens JWT
- `JWT_EXPIRES_IN`: Tempo de expiração do token (padrão: `7d`)

## 📁 Estrutura do Projeto

```
middlewares/
├── prisma/
│   ├── migrations/          # Migrações do banco de dados
│   ├── schema.prisma        # Schema do Prisma
│   └── seed.js              # Script de seed
├── src/
│   ├── config/
│   │   └── db.js            # Configuração do Prisma Client
│   ├── controllers/
│   │   ├── authController.js      # Lógica de autenticação
│   │   └── watchlistController.js # Lógica da watchlist
│   ├── middleware/
│   │   └── authMiddleware.js      # Middleware de autenticação JWT
│   ├── routes/
│   │   ├── authRoutes.js          # Rotas de autenticação
│   │   ├── movieRoutes.js         # Rotas de filmes
│   │   └── watchlistRoutes.js     # Rotas da watchlist
│   ├── utils/
│   │   └── generateToken.js       # Geração de tokens JWT
│   └── server.js                  # Arquivo principal do servidor
├── .env.example                   # Exemplo de variáveis de ambiente
├── package.json                   # Dependências e scripts
└── README.md                      # Documentação
```

## 🔌 Endpoints da API

### Autenticação (`/auth`)

#### POST `/auth/register`
Registra um novo usuário.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta (201):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@example.com"
    },
    "token": "jwt_token_aqui"
  }
}
```

#### POST `/auth/login`
Autentica um usuário existente.

**Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta (201):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "joao@example.com"
    },
    "token": "jwt_token_aqui"
  }
}
```

#### POST `/auth/logout`
Faz logout do usuário (invalida o token).

**Resposta (200):**
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

### Filmes (`/movies`)

> **Nota:** As rotas de filmes estão em desenvolvimento e retornam mensagens de placeholder.

- `GET /movies` - Lista todos os filmes
- `POST /movies` - Cria um novo filme
- `PUT /movies` - Atualiza um filme
- `DELETE /movies` - Remove um filme

### Watchlist (`/watchlist`)

> **Requer autenticação:** Todas as rotas de watchlist requerem token JWT válido.

#### POST `/watchlist`
Adiciona um filme à watchlist do usuário autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "movieId": "uuid_do_filme",
  "status": "PLANNED",
  "rating": 8,
  "notes": "Filme muito bom!"
}
```

**Status possíveis:**
- `PLANNED` - Planejado para assistir
- `WATCHING` - Assistindo atualmente
- `COMPLETED` - Concluído
- `DROPPED` - Abandonado

**Resposta (201):**
```json
{
  "data": {
    "watchlistItem": {
      "id": "uuid",
      "userId": "uuid",
      "movieId": "uuid",
      "status": "PLANNED",
      "rating": 8,
      "notes": "Filme muito bom!",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### DELETE `/watchlist/:id`
Remove um item da watchlist.

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta (200):**
```json
{
  "status": "success",
  "message": "Movie removed from watchlist"
}
```

## 💾 Modelos de Dados

### User
```prisma
{
  id: String (UUID)
  name: String
  email: String (único)
  password: String (criptografado)
  createdAt: DateTime
}
```

### Movie
```prisma
{
  id: String (UUID)
  title: String
  overview: String?
  releaseYear: Int
  genres: String[]
  runtime: Int?
  posterUrl: String?
  createdBy: String (FK para User)
  createdAt: DateTime
}
```

### WatchListItem
```prisma
{
  id: String (UUID)
  userId: String (FK para User)
  movieId: String (FK para Movie)
  status: watchListStatus (PLANNED | WATCHING | COMPLETED | DROPPED)
  rating: Int?
  notes: String?
  createdAt: DateTime
  updatedAt: DateTime
}
```

## ▶️ Executando o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

O servidor será iniciado na porta `3000` com hot-reload ativado.

### Modo Produção

```bash
node src/server.js
```

## 📜 Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento com nodemon
- `npm run seed:movies` - Popula o banco de dados com dados de exemplo
- `npx prisma migrate dev` - Executa migrações do banco de dados

## 🔒 Autenticação

A API utiliza autenticação baseada em JWT (JSON Web Tokens). Para acessar rotas protegidas:

1. Faça login ou registre-se para obter um token
2. Inclua o token no header `Authorization`:
   ```
   Authorization: Bearer <seu_token>
   ```
3. O token também pode ser enviado via cookie `jwt`

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 👤 Autor

Desenvolvido como projeto de estudo sobre middlewares e autenticação em Node.js.