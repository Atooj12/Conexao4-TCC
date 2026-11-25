import { apiFetch } from '@/lib/api'
import { STATUS_PEDIDO, toOrder, type ListaPaginada, type PedidoDto } from '@/lib/adapters'
import type { Order, OrderStatus } from '@/lib/types'

// Chamadas de pedido: primeiro as do cliente, depois as do admin
const BASE = '/api/app/pedido'

// Pedidos do usuário logado, do mais novo para o mais antigo
export async function buscarMeusPedidos(): Promise<Order[]> {
  const lista = await apiFetch<PedidoDto[]>(`${BASE}/meus-pedidos`)
  return lista.map(toOrder)
}

// O back só devolve o pedido se ele for do usuário (ou se for admin)
export async function buscarPedido(id: string): Promise<Order> {
  return toOrder(await apiFetch<PedidoDto>(`${BASE}/${encodeURIComponent(id)}`))
}

// Só funciona enquanto o pedido está Pendente (regra do back)
export async function cancelarPedido(id: string): Promise<Order> {
  return toOrder(await apiFetch<PedidoDto>(`${BASE}/${encodeURIComponent(id)}/cancelar`, { method: 'POST' }))
}

// ---------- Admin (precisa da permissão Conexao4.Pedidos.Gerenciar) ----------

// Avisa outras partes da tela (ex.: o contador do menu do admin) que algum pedido mudou
export const PEDIDOS_MUDARAM = 'c4:pedidos-mudaram'

export interface PaginaPedidos {
  total: number // total no banco com esse filtro (não só os desta página)
  pedidos: Order[]
}

// Lista de todos os clientes, do mais novo para o mais antigo. Sem status = todos.
export async function buscarTodosPedidos(status: OrderStatus | null, skip = 0, max = 50): Promise<PaginaPedidos> {
  const params = new URLSearchParams({ SkipCount: String(skip), MaxResultCount: String(max) })
  if (status) params.set('Status', String(STATUS_PEDIDO.indexOf(status)))
  const res = await apiFetch<ListaPaginada<PedidoDto>>(`${BASE}/todos?${params}`)
  return { total: res.totalCount, pedidos: res.items.map(toOrder) }
}

// Quantos pedidos existem em cada status (pede só a contagem: MaxResultCount=1)
export async function contarPedidosPorStatus(): Promise<Record<OrderStatus | 'all', number>> {
  const contar = async (status: OrderStatus | null) => (await buscarTodosPedidos(status, 0, 1)).total
  const [all, ...porStatus] = await Promise.all([contar(null), ...STATUS_PEDIDO.map(contar)])
  const resultado = { all } as Record<OrderStatus | 'all', number>
  STATUS_PEDIDO.forEach((s, i) => { resultado[s] = porStatus[i] })
  return resultado
}

export async function contarPedidosPendentes(): Promise<number> {
  return (await buscarTodosPedidos('pending', 0, 1)).total
}

export async function alterarStatusPedido(id: string, status: OrderStatus): Promise<Order> {
  const numero = STATUS_PEDIDO.indexOf(status)
  const pedido = toOrder(await apiFetch<PedidoDto>(`${BASE}/${encodeURIComponent(id)}/alterar-status?status=${numero}`, { method: 'POST' }))
  window.dispatchEvent(new Event(PEDIDOS_MUDARAM))
  return pedido
}

// Próximo passo do fluxo: Pendente → Confirmado → Em preparo → Pronto → Entregue
export const proximoStatus: Partial<Record<OrderStatus, { status: OrderStatus; acao: string }>> = {
  pending: { status: 'confirmed', acao: 'Confirmar pedido' },
  confirmed: { status: 'preparing', acao: 'Iniciar preparo' },
  preparing: { status: 'ready', acao: 'Marcar como pronto' },
  ready: { status: 'delivered', acao: 'Marcar como entregue' },
}

export interface Dashboard {
  vendasHoje: number
  pedidosHoje: number // de hoje, sem os cancelados
  ticketMedio: number
  pedidosPendentes: number
  topProdutos: { produtoId: number; nome: string; quantidade: number; receita: number }[] // de sempre, top 5
}

export async function buscarDashboard(): Promise<Dashboard> {
  return apiFetch<Dashboard>(`${BASE}/dashboard`)
}
