# App Android: telas

O app mobile é o **app do cliente**. A gestão (admin) fica no site, e as telas de admin no celular são opcionais (ver o fim deste documento).

Todas as rotas, com exemplos de request e response, estão em [`API.md`](API.md).

## Configuração antes de começar
- **URL base:**
  - no emulador: `http://10.0.2.2:5000`
  - no celular físico: `http://<IP-do-PC>:5000`, com a porta 5000 liberada no firewall do Windows.
- **HTTP sem SSL:** o Android bloqueia por padrão. Coloque `android:usesCleartextTraffic="true"` no `<application>` do `AndroidManifest.xml`, ou use um `network_security_config`.
- **Token:** depois do login, guarde o `access_token` (DataStore ou SharedPreferences) e mande `Authorization: Bearer <token>` em toda chamada.
  - Se vier **401**, apague o token e volte pro Login.
- **Erros de regra** chegam assim: `{ "error": { "message": "..." } }`. Mostre a `message` num Toast ou Snackbar.
- **Usuários de teste** (senha `1q2w3E*`): `cliente@conexao4.com` e `admin@abp.io`.

## Navegação
- **Sem login:** Splash → Login ⇄ Cadastro.
- **Logado:** barra inferior com 4 abas: **Cardápio | Carrinho | Pedidos | Perfil**.
  - Detalhe do produto, Checkout, Pedido confirmado e Detalhe do pedido abrem por cima das abas.

---

## 1. Splash
- **O que faz:** mostra o logo enquanto confere se existe token salvo.
- **API:** `GET /api/abp/application-configuration`
  - Se `currentUser.isAuthenticated` vier `true`, vai pro Cardápio.
  - Senão, vai pro Login.

## 2. Login
- **Campos:** e-mail e senha. Botão "Entrar" e link "Criar conta".
- **API:** `POST /connect/token` (form-urlencoded, ver API.md §1). O campo `username` aceita o e-mail.
- **Erros:** status 400 → "E-mail ou senha inválidos".
- **Detalhe:** mostrar loading no botão e bloquear clique duplo.

## 3. Cadastro
- **Campos:** e-mail, senha e confirmar senha.
- **API:** `POST /api/account/register` com `{ userName: email, emailAddress: email, password, appName: "Conexao4" }`. Depois disso, já faz o login automático (mesma chamada da tela 2).
- **Regra da senha:** mínimo de 6 caracteres, sem outras exigências. Se não passar, mostrar a mensagem que vem do back.

## 4. Cardápio (aba inicial)
- **Mostra:** lista ou grade de produtos com imagem, nome, preço e categoria.
- **Filtros:** chips de categoria (Todos, Cafés, Bebidas Geladas, Lanches, Doces, Salgados, Especiais) e campo de busca por nome. O filtro é feito no app; não precisa de rota nova.
- **API:** `GET /api/app/produto?MaxResultCount=100`. Essa rota é pública.
  - `categoria`: 0 Cafés, 1 Bebidas Geladas, 2 Lanches, 3 Doces, 4 Salgados, 5 Especiais.
- **Regra:** produto com `disponivel = false` aparece apagado, com o selo "Indisponível" e sem botão de adicionar.
- **Ação:** tocar no produto abre o Detalhe. Tem também um botão "+" rápido, que adiciona 1 unidade.
- **Bom ter:** puxar pra atualizar (pull-to-refresh).

## 5. Detalhe do produto
- **Mostra:** imagem grande, nome, descrição, preço, seletor de quantidade (– 1 +) e botão "Adicionar ao carrinho – R$ total".
- **API:**
  - `GET /api/app/produto/{id}`
  - `POST /api/app/item-pedido/adicionar-ao-carrinho/{produtoId}?quantidade=N`
- **Depois de adicionar:** Snackbar "Adicionado ao carrinho" com a ação "Ver carrinho". Atualizar o badge da aba Carrinho.

## 6. Carrinho (aba)
- **Mostra:** itens com imagem, nome, preço unitário, quantidade (– +), subtotal e botão remover. No rodapé ficam o **total** e o botão "Finalizar pedido".
- **API:**
  - Listar: `GET /api/app/item-pedido`. Usar `items[]`, que já vem com `produto` e `subtotal`.
  - Mudar quantidade: `POST /api/app/item-pedido/{id}/alterar-quantidade?quantidade=N`. O mínimo é 1; pra 0, chamar o DELETE.
  - Remover: `DELETE /api/app/item-pedido/{id}`
  - Esvaziar: `POST /api/app/item-pedido/limpar-carrinho`, com um diálogo de confirmação antes.
- **Total:** soma dos `subtotal` dos itens.
- **Vazio:** ilustração + "Seu carrinho está vazio" + botão "Ver cardápio".

## 7. Checkout
- **Mostra:** resumo dos itens e do total.
  - Escolha da **forma de pagamento**: Pix, Crédito, Débito, Dinheiro (valores 0 a 3).
  - Escolha do **tipo de pedido**: Retirada no balcão ou Consumir no local (0 e 1).
  - Campo **observação** (opcional, até 500 caracteres).
- **API:** `POST /api/app/item-pedido/finalizar-carrinho` com o body `{ formaPagamento, tipoPedido, observacao }`. A resposta já é o pedido criado.
- **Erros possíveis:** "Seu carrinho está vazio", "Indisponível no momento: ...".
- **Observação:** o pagamento é só a escolha da forma, sem integração real. Não tem delivery.

## 8. Pedido confirmado
- **Mostra:** ícone de sucesso, "Pedido #ID recebido!", o total e o status "Pendente".
- **Botões:** "Acompanhar pedido" (vai pro Detalhe do pedido) e "Voltar ao cardápio".
- **API:** nenhuma; usa a resposta do checkout.

## 9. Meus pedidos (aba)
- **Mostra:** lista do mais novo pro mais antigo. Cada item tem `#id`, data (`creationTime`), quantidade de itens, total e um **chip de status** colorido.
- **API:** `GET /api/app/pedido/meus-pedidos`
- **Status:** 0 Pendente, 1 Confirmado, 2 Em preparo, 3 Pronto, 4 Entregue, 5 Cancelado.
- **Bom ter:** pull-to-refresh, pra ver o status mudando quando o admin atualiza no site.
- **Vazio:** "Você ainda não fez pedidos".

## 10. Detalhe do pedido
- **Mostra:**
  - Linha do tempo do status: Pendente → Confirmado → Em preparo → Pronto → Entregue. Se o pedido estiver cancelado, mostrar só "Cancelado".
  - Itens com quantidade × `precoUnitario`, e o total.
  - Forma de pagamento, tipo e observação.
- **API:** `GET /api/app/pedido/{id}`
- **Ação:** botão **"Cancelar pedido"**, que só aparece se o status for Pendente (0). Ele chama `POST /api/app/pedido/{id}/cancelar` com um diálogo de confirmação antes.
- **Bom ter:** atualizar a cada ~15 s enquanto a tela estiver aberta, ou pull-to-refresh.

## 11. Perfil (aba)
- **Mostra:** nome (ou e-mail) e e-mail do usuário, além de um atalho "Meus pedidos".
- **API:** `GET /api/abp/application-configuration` (campo `currentUser`).
- **Ação:** **"Sair da conta"** apaga o token e volta pro Login.

---

## Opcional: modo admin no celular (só se sobrar tempo)
Mostrar só se `auth.grantedPolicies["Conexao4.Pedidos.Gerenciar"] == true` (dá pra fazer como uma 5ª aba).

- **A1. Painel:** vendas de hoje, pedidos de hoje, ticket médio, pendentes e top 5 produtos. Rota: `GET /api/app/pedido/dashboard`.
- **A2. Pedidos da loja:** lista com filtro por status e botão pra avançar o status. Rotas: `GET /api/app/pedido/todos?Status=` e `POST /api/app/pedido/{id}/alterar-status?status=N`.

O cadastro de produtos (CRUD) fica só no site.

## Resumo: checklist
| # | Tela | Obrigatória |
|---|---|---|
| 1 | Splash | sim |
| 2 | Login | sim |
| 3 | Cadastro | sim |
| 4 | Cardápio | sim |
| 5 | Detalhe do produto | sim |
| 6 | Carrinho | sim |
| 7 | Checkout | sim |
| 8 | Pedido confirmado | sim (pode ser um diálogo) |
| 9 | Meus pedidos | sim |
| 10 | Detalhe do pedido | sim |
| 11 | Perfil | sim |
| A1–A2 | Admin | opcional |
