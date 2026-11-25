import { apiFetch } from '@/lib/api'
import { toOrder, type PedidoDto } from '@/lib/adapters'
import type { Order } from '@/lib/types'

// Chamadas de pedido do cliente (as do admin ficam nas telas do admin)
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
