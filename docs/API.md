# API Conexão 4 Café: guia rápido (web e Android)

Swagger com todas as rotas: `https://localhost:44318/swagger`

| Quem chama | URL base |
|---|---|
| Navegador / Next.js | `https://localhost:44318` (rodar `dotnet dev-certs https --trust` uma vez) |
| Emulador Android | `http://10.0.2.2:5000` |
| Celular físico na mesma rede | `http://<IP-do-PC>:5000` (liberar a porta 5000 no firewall do Windows) |

Usuários de teste (senha `1q2w3E*`):
- `admin`: tem todas as permissões.
- `cliente`: usuário comum.

## 1. Login (token)

```
POST /connect/token
Content-Type: application/x-www-form-urlencoded

grant_type=password&client_id=Conexao4_App&username=cliente&password=1q2w3E*&scope=Conexao4 offline_access roles
```

A resposta traz `{ "access_token": "...", "refresh_token": "...", "expires_in": 3600 }`.

Nas outras chamadas, mande o header `Authorization: Bearer <access_token>`.
- Sem token ou com token vencido: **401**.
- Sem permissão: **403**.

Para renovar o token: `grant_type=refresh_token&client_id=Conexao4_App&refresh_token=<...>`.

## 2. Cadastro

```
POST /api/account/register
{ "userName": "joao", "emailAddress": "joao@email.com", "password": "Senha123!", "appName": "Conexao4" }
```

A senha só precisa ter pelo menos 6 caracteres. O back desliga as exigências padrão do ABP (maiúscula, minúscula, número e símbolo) em `Conexao4.Domain/Identity/ChangeIdentityPasswordPolicySettingDefinitionProvider.cs`.

## 3. Quem está logado / é admin?

`GET /api/abp/application-configuration` (com token)
- `currentUser.userName`, `currentUser.name`, `currentUser.email`
- **Admin** = `auth.grantedPolicies["Conexao4.Pedidos.Gerenciar"] == true`

## 4. Produtos (cardápio)

| Método | Rota | Auth |
|---|---|---|
| GET | `/api/app/produto?MaxResultCount=100` | público |
| GET | `/api/app/produto/{id}` | público |
| POST | `/api/app/produto` | admin |
| PUT | `/api/app/produto/{id}` | admin |
| DELETE | `/api/app/produto/{id}` | admin |

Corpo para criar/editar:

```json
{ "nome": "Café", "descricao": "...", "preco": 9.90, "urlImagem": "https://...", "categoria": 0, "disponivel": true }
```

`categoria` é um número: 0 Cafes, 1 BebidasGeladas, 2 Lanches, 3 Doces, 4 Salgados, 5 Especiais.

## 5. Carrinho (precisa de login)

| Método | Rota | O que faz |
|---|---|---|
| GET | `/api/app/item-pedido` | lista os itens do carrinho (`items[]` com `produto`, `quantidade`, `precoUnitario`, `subtotal`) |
| POST | `/api/app/item-pedido/adicionar-ao-carrinho/{produtoId}?quantidade=1` | adiciona; se o produto já estiver lá, soma a quantidade |
| POST | `/api/app/item-pedido/{id}/alterar-quantidade?quantidade=3` | muda a quantidade (mínimo 1) |
| DELETE | `/api/app/item-pedido/{id}` | remove o item |
| POST | `/api/app/item-pedido/limpar-carrinho` | esvazia o carrinho |
| POST | `/api/app/item-pedido/finalizar-carrinho` | cria o pedido (corpo abaixo) e devolve o `PedidoDto` |

```json
{ "formaPagamento": 0, "tipoPedido": 0, "observacao": "sem açúcar" }
```

- `formaPagamento`: 0 Pix, 1 Credito, 2 Debito, 3 Dinheiro.
- `tipoPedido`: 0 Retirada, 1 Local.

O total é calculado no servidor.

## 6. Pedidos

| Método | Rota | Auth |
|---|---|---|
| GET | `/api/app/pedido/meus-pedidos` | cliente: lista do mais novo pro mais antigo |
| GET | `/api/app/pedido/{id}` | dono do pedido ou admin |
| POST | `/api/app/pedido/{id}/cancelar` | cliente, só se ainda estiver Pendente |
| GET | `/api/app/pedido/todos?Status=0&SkipCount=0&MaxResultCount=50` | admin (sem `Status` = todos) |
| POST | `/api/app/pedido/{id}/alterar-status?status=2` | admin |
| GET | `/api/app/pedido/dashboard` | admin |

`status`: 0 Pendente, 1 Confirmado, 2 EmPreparo, 3 Pronto, 4 Entregue, 5 Cancelado.

Um pedido Entregue ou Cancelado não muda mais de status.

Exemplo de `PedidoDto`:

```json
{
  "id": 1, "userId": "...", "nomeCliente": "Cliente Teste", "status": 0, "total": 78.5,
  "formaPagamento": 0, "tipoPedido": 1, "observacao": "sem açúcar", "creationTime": "2026-11-12T13:45:10",
  "itens": [ { "id": 1, "produtoId": 1, "quantidade": 3, "precoUnitario": 14.9, "subtotal": 44.7,
               "produto": { "id": 1, "nome": "Cappuccino Italiano", "urlImagem": "https://..." } } ]
}
```

Exemplo do dashboard:

```json
{ "vendasHoje": 78.5, "pedidosHoje": 1, "ticketMedio": 78.5, "pedidosPendentes": 0, "topProdutos": [ { "produtoId": 1, "nome": "...", "quantidade": 3, "receita": 44.7 } ] }
```

## Erros

Os erros de regra vêm em JSON com status 403. Mostre a `message` pro usuário:

```json
{ "error": { "message": "Seu carrinho está vazio." } }
```
