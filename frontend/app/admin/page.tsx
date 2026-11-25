'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Clock,
  Coffee,
  Plus,
  RefreshCw,
  ArrowRight,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/pedido-status'
import { STATUS_PEDIDO } from '@/lib/adapters'
import {
  buscarDashboard,
  buscarTodosPedidos,
  contarPedidosPorStatus,
  type Dashboard,
} from '@/lib/pedidos'
import { useProdutos } from '@/lib/use-produtos'
import { useIntervalo } from '@/lib/use-intervalo'
import { formatCurrency, formatDateTime, formatTime } from '@/lib/format'
import { orderStatusLabels, type Order, type OrderStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-blue-500',
  preparing: 'bg-orange-500',
  ready: 'bg-green-500',
  delivered: 'bg-green-700',
  cancelled: 'bg-red-500',
}

function mesmoDia(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export default function AdminDashboardPage() {
  const { produtos } = useProdutos() // só para mostrar a foto no "mais vendidos"

  const [dash, setDash] = useState<Dashboard | null>(null)
  const [recentes, setRecentes] = useState<Order[]>([])
  const [porStatus, setPorStatus] = useState<Record<OrderStatus | 'all', number> | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [atualizando, setAtualizando] = useState(false)

  const carregar = useCallback(async () => {
    try {
      // Os números vêm prontos do back (/dashboard). A lista e as contagens completam a tela.
      const [d, pagina, contagens] = await Promise.all([
        buscarDashboard(),
        buscarTodosPedidos(null, 0, 200),
        contarPedidosPorStatus(),
      ])
      setDash(d)
      setRecentes(pagina.pedidos)
      setPorStatus(contagens)
      setErro(null)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível carregar o dashboard.')
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  useIntervalo(carregar, 30000, true)

  const atualizarAgora = async () => {
    setAtualizando(true)
    await carregar()
    setAtualizando(false)
  }

  // Vendas de hoje por hora (sem cancelados), a partir dos pedidos mais recentes
  const vendasPorHora = useMemo(() => {
    const hoje = new Date()
    const pedidosHoje = recentes.filter(p => p.status !== 'cancelled' && mesmoDia(p.createdAt, hoje))
    if (pedidosHoje.length === 0) return []
    const horas = pedidosHoje.map(p => p.createdAt.getHours())
    const inicio = Math.min(8, ...horas)
    const fim = Math.max(18, ...horas)
    return Array.from({ length: fim - inicio + 1 }, (_, i) => {
      const hora = inicio + i
      const total = pedidosHoje.filter(p => p.createdAt.getHours() === hora).reduce((s, p) => s + p.total, 0)
      return { hora, total: Math.round(total * 100) / 100 }
    })
  }, [recentes])

  const fotoDoProduto = (id: number) => produtos.find(p => p.id === String(id))?.image

  if (erro && !dash) {
    return (
      <div className="text-center py-16">
        <p className="font-medium mb-1">Não foi possível carregar o dashboard</p>
        <p className="text-sm text-muted-foreground mb-4">{erro}</p>
        <Button variant="outline" onClick={atualizarAgora}>Tentar de novo</Button>
      </div>
    )
  }

  const cards = [
    { titulo: 'Vendas hoje', valor: dash && formatCurrency(dash.vendasHoje), icone: DollarSign, rodape: 'Soma dos pedidos de hoje, sem cancelados' },
    { titulo: 'Pedidos hoje', valor: dash?.pedidosHoje, icone: ShoppingCart, rodape: 'Sem contar os cancelados' },
    { titulo: 'Ticket médio', valor: dash && formatCurrency(dash.ticketMedio), icone: TrendingUp, rodape: 'Vendas de hoje ÷ pedidos de hoje' },
    { titulo: 'Pedidos pendentes', valor: dash?.pedidosPendentes, icone: Clock, rodape: 'Aguardando confirmação', link: '/admin/pedidos?status=pending' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral de hoje. Atualiza sozinho a cada 30 s.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={atualizarAgora} disabled={atualizando}>
            <RefreshCw className={cn('h-4 w-4', atualizando && 'animate-spin')} />
            Atualizar
          </Button>
          <Button className="gap-2" asChild>
            <Link href="/admin/produtos?novo=1">
              <Plus className="h-4 w-4" />
              Novo produto
            </Link>
          </Button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => {
          const conteudo = (
            <Card className={cn(c.link && 'hover:shadow-md transition-shadow')}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{c.titulo}</CardTitle>
                <c.icone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {dash ? (
                  <div className="text-2xl font-bold">{c.valor}</div>
                ) : (
                  <div className="h-8 w-24 bg-muted rounded animate-pulse" />
                )}
                <p className="text-xs text-muted-foreground mt-1">{c.rodape}</p>
              </CardContent>
            </Card>
          )
          return (
            <motion.div key={c.titulo} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              {c.link ? <Link href={c.link}>{conteudo}</Link> : conteudo}
            </motion.div>
          )
        })}
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle>Vendas por hora (hoje)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {!dash ? (
                  <div className="h-full bg-muted rounded animate-pulse" />
                ) : vendasPorHora.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <Coffee className="h-10 w-10 mb-2 opacity-40" />
                    <p className="text-sm">Nenhuma venda hoje ainda</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={vendasPorHora}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="hora" tickFormatter={(h) => `${h}h`} fontSize={12} />
                      <YAxis tickFormatter={(v) => `R$${v}`} fontSize={12} width={60} />
                      <Tooltip
                        formatter={(value: number) => [formatCurrency(value), 'Vendas']}
                        labelFormatter={(h) => `${h}:00 às ${h}:59`}
                        contentStyle={{
                          backgroundColor: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="total" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Pedidos por status</CardTitle>
              <p className="text-sm text-muted-foreground">Todos os pedidos já feitos</p>
            </CardHeader>
            <CardContent>
              {!porStatus ? (
                <div className="space-y-4">
                  {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-8 bg-muted rounded animate-pulse" />)}
                </div>
              ) : (
                <div className="space-y-4">
                  {STATUS_PEDIDO.map(status => {
                    const quantidade = porStatus[status]
                    const pct = porStatus.all === 0 ? 0 : (quantidade / porStatus.all) * 100
                    return (
                      <Link key={status} href={`/admin/pedidos?status=${status}`} className="block space-y-2 group">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={cn('h-3 w-3 rounded-full', statusColors[status])} />
                            <span className="group-hover:underline">{orderStatusLabels[status]}</span>
                          </div>
                          <span className="font-medium">{quantidade}</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div className={cn('h-full rounded-full', statusColors[status])} style={{ width: `${pct}%` }} />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Mais vendidos e pedidos recentes */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Produtos mais vendidos</CardTitle>
              <p className="text-sm text-muted-foreground">Desde o início, sem pedidos cancelados</p>
            </CardHeader>
            <CardContent>
              {!dash ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-muted rounded animate-pulse" />)}
                </div>
              ) : dash.topProdutos.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Nenhuma venda ainda</p>
              ) : (
                <div className="space-y-4">
                  {dash.topProdutos.map((item, index) => {
                    const foto = fotoDoProduto(item.produtoId)
                    return (
                      <div key={item.produtoId} className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted font-bold text-muted-foreground shrink-0">
                          {index + 1}
                        </div>
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-secondary flex items-center justify-center shrink-0">
                          {foto ? (
                            <Image src={foto} alt={item.nome} fill className="object-cover" sizes="48px" />
                          ) : (
                            <Coffee className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.nome}</p>
                          <p className="text-sm text-muted-foreground">{formatCurrency(item.receita)} em vendas</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{item.quantidade}</p>
                          <p className="text-xs text-muted-foreground">vendidos</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pedidos recentes</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1" asChild>
                <Link href="/admin/pedidos">
                  Ver todos
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {!dash ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-muted rounded animate-pulse" />)}
                </div>
              ) : recentes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Nenhum pedido ainda</p>
              ) : (
                <div className="space-y-4">
                  {recentes.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">#{order.id} · {order.customerName || '-'}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {mesmoDia(order.createdAt, new Date()) ? formatTime(order.createdAt) : formatDateTime(order.createdAt)} · {order.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-medium">{formatCurrency(order.total)}</p>
                        <StatusBadge status={order.status} className="text-xs" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
