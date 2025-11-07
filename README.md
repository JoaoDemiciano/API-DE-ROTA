# RotaPerfeita

Aplicação full-stack para planejamento inteligente de rotas com autenticação, painel do usuário, painel administrativo e histórico de consultas.

## Visão Geral

- **Front-end**: React + TypeScript + Tailwind CSS (tema claro/escuro persistente)
- **Back-end**: Node.js + Express + TypeScript
- **Banco de dados**: PostgreSQL (via Prisma)
- **Mapas & Rotas**: Mapbox Directions API (com fallback para OpenRouteService)
- **Autenticação**: JWT com tokens de refresh, hash de senha (bcrypt)

## Estrutura do Projeto

```
├── server/          # API Express + Prisma
├── web/             # Interface web em React
├── .env.example     # Variáveis de ambiente necessárias
└── README.md
```

## Pré-requisitos

- Node.js >= 18
- npm >= 9
- PostgreSQL >= 13
- Conta e chave para [Mapbox Directions API](https://docs.mapbox.com/api/navigation/directions/)

## Configuração

1. Copie o arquivo `.env.example` para `.env` (tanto na raiz quanto nos diretórios `server/` e `web/` caso prefira arquivos separados) e ajuste os valores.
2. Instale as dependências:
   ```bash
   cd server && npm install
   cd ../web && npm install
   ```
3. Gere o cliente Prisma e aplique as migrações:
   ```bash
   cd server
   npx prisma migrate dev --name init
   npm run seed
   ```

## Execução em Desenvolvimento

Em terminais separados:

```bash
cd server
npm run dev
```

```bash
cd web
npm run dev
```

A API estará disponível em `http://localhost:4000` e o front-end em `http://localhost:5173`.

## Scripts Principais

### Backend (`server`)
- `npm run dev`: executa a API com `ts-node-dev`
- `npm run build`: gera a versão compilada
- `npm run start`: inicia a API compilada
- `npm run test`: executa testes unitários (Jest + Supertest)
- `npm run seed`: cria usuários admin (`admin@rotaperfeita.com`) e demo (`demo@rotaperfeita.com`)

### Frontend (`web`)
- `npm run dev`: inicia o Vite em modo desenvolvimento
- `npm run build`: build de produção
- `npm run preview`: pré-visualização do build

## Funcionalidades

### Usuário
- Autenticação por e-mail/senha
- Sugestões inteligentes de waypoints, correção de endereços e alternativas de rota
- Visualização da rota em mapa interativo com métricas de distância e tempo
- Histórico paginado com reabertura rápida de rotas
- Alternativas "Evitar pedágios" e "Evitar tráfego"

### Administrador
- Listagem e ativação/desativação de usuários
- Auditoria de histórico com filtros e exportação CSV
- Métricas agregadas (rotas/dia, distância e tempo médios)

## Testes

```bash
cd server
npm run test
```

## Segurança e LGPD

- Hash de senhas com `bcrypt`
- Tokens JWT com refresh e expiração configuráveis
- CORS configurável via variáveis de ambiente
- Logs sem dados sensíveis

## Notas

- O login social via Google pode ser integrado utilizando o endpoint `/auth/login` em conjunto com um provedor OAuth externo, persistindo o usuário via Prisma.
- Configure `MAPBOX_TOKEN` ou `ORS_TOKEN` para habilitar o provedor de rotas desejado.
