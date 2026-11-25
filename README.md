# Conexão 4 Café (TCC)

- `backend/`: API em ABP 10.3 / .NET 10, com banco SQLite em arquivo (`backend/Conexao4.db`).
- `frontend/`: Next.js.
- `docs/API.md`: guia das rotas (para o front e para o app Android).
- App Android (.NET MAUI): repositório separado, [ivraal/Conexao4.App](https://github.com/ivraal/Conexao4.App). Usa esta mesma API.

## Back-end

Pré-requisitos: .NET 10 SDK e Node.js.

Primeira vez:

```
dotnet tool install -g Volo.Abp.Studio.Cli
cd backend/src/Conexao4.Blazor && abp install-libs
dotnet dev-certs https --trust
```

Rodar:

```
cd backend/src/Conexao4.DbMigrator && dotnet run   # cria/atualiza o banco e insere os dados iniciais
cd backend/src/Conexao4.Blazor && dotnet run       # sobe a API
```

- API: `https://localhost:44318`
- Swagger: `https://localhost:44318/swagger`
- HTTP para o Android: `http://localhost:5000` (no emulador, `http://10.0.2.2:5000`)

Usuários de teste: `admin` e `cliente`, os dois com a senha `1q2w3E*`.

Para mudar uma entidade:

```
dotnet tool install -g dotnet-ef
cd backend/src/Conexao4.EntityFrameworkCore && dotnet ef migrations add NomeDaMudanca
```

Depois disso, rode o DbMigrator de novo.

## Front-end

```
cd frontend && npm install && npm run dev
```

O front roda em `http://localhost:3000`. Crie o arquivo `frontend/.env.local` com:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Depois de criar o arquivo, reinicie o `npm run dev`. Entre com `admin` ou `cliente@conexao4.com` (senha `1q2w3E*`).
