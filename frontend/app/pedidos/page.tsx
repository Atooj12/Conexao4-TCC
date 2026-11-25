'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Coffee, ArrowRight, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ClientLayout } from '@/components/client-layout'
import { OrderProgress, StatusBadge, statusConfig } from '@/components/pedido-status'
import { useExigirLogin } from '@/lib/auth-context'
import { pedidoEncerrado } from '@/lib/adapters'
import { buscarMeusPedidos } from '@/lib/pedidos'
import { useIntervalo } from '@/lib/use-intervalo'
import { formatCurrency, formatDateTime } from '@/lib/format'
import type { Order } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function OrdersPage() {
  const { pronto } = useExigirLogin('/pedidos')
  const [orders, setOrders] = useState<Order[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [atualizando, setAtualizando] = useState(false)

  // `silencioso`: atualização automática, sem mostrar o carregando
  const carregar = useCallback(async (silencioso = false) => {
    if (!silencioso) setCarregando(true)
    try {
      setOrders(await buscarMeusPedidos())
      setErro(null)
    } catch (err) {
      if (!silencioso) setErro(err instanceof Error ? err.message : 'Não foi possível carregar seus pedidos.')
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    if (pronto) carregar()
  }, [pronto, carregar])

  const activeOrders = orders.filter(o => !pedidoEncerrado(o.status))
  const completedOrders = orders.filter(o => pedidoEncerrado(o.status))

  // Enquanto houver pedido em andamento, confere o status a cada 20 s
  useIntervalo(() => carregar(true), 20000, pronto && activeOrders.length > 0)

  const atualizarAgora = async () => {
    setAtualizando(true)
    await carregar(true)
    setAtualizando(false)
  }

  return (
    <ClientLayout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-primary text-primary-foreground py-12">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
                Meus Pedidos
              </h1>
              <p className="text-primary-foreground/80">
                Acompanhe seus pedidos: o status atualiza sozinho
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container px-4 py-8 md:px-6">
          {!pronto || carregando ? (
            <div className="space-y-4 max-w-3xl mx-auto">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : erro ? (
            <div className="text-center py-16">
              <p className="font-medium mb-1">Não foi possível carregar seus pedidos</p>
              <p className="text-sm text-muted-foreground mb-4">{erro}</p>
              <Button variant="outline" className="gap-2" onClick={() => carregar()}>
                <RefreshCw className="h-4 w-4" />
                Tentar de novo
              </Button>
            </div>
          ) : (
            <Tabs defaultValue={activeOrders.length > 0 || completedOrders.length === 0 ? 'active' : 'history'} className="space-y-6">
              <div className="flex items-center justify-center gap-2">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="active" className="gap-2">
                    Em andamento
                    {activeOrders.length > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {activeOrders.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="history">Histórico</TabsTrigger>
                </TabsList>
                <Button variant="ghost" size="icon" onClick={atualizarAgora} disabled={atualizando} title="Atualizar">
                  <RefreshCw className={cn('h-4 w-4', atualizando && 'animate-spin')} />
                  <span className="sr-only">Atualizar</span>
                </Button>
              </div>

              <TabsContent value="active">
                {activeOrders.length === 0 ? (
                  <EmptyState
                    title="Nenhum pedido em andamento"
                    description="Faça um pedido e acompanhe aqui"
                  />
                ) : (
                  <div className="space-y-4 max-w-3xl mx-auto">
                    {activeOrders.map((order, index) => (
                      <OrderCard key={order.id} order={order} index={index} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="history">
                {completedOrders.length === 0 ? (
                  <EmptyState
                    title="Nenhum pedido no histórico"
                    description="Pedidos entregues ou cancelados aparecem aqui"
                  />
                ) : (
                  <div className="space-y-4 max-w-3xl mx-auto">
                    {completedOrders.map((order, index) => (
                      <OrderCard key={order.id} order={order} index={index} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </ClientLayout>
  )
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-16"
    >
      <Coffee className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      <Button asChild>
        <Link href="/menu">Ver Cardápio</Link>
      </Button>
    </motion.div>
  )
}

function OrderCard({ order, index }: { order: Order; index: number }) {
  const config = statusConfig[order.status]
  const StatusIcon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 5) * 0.08 }}
    >
      <Link href={`/pedidos/${order.id}`}>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 min-w-0">
                <div className={cn('p-3 rounded-full shrink-0', config.bgColor)}>
                  <StatusIcon className={cn('h-5 w-5', config.color)} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-medium">#{order.id}</span>
                    <StatusBadge status={order.status} className="text-xs" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {formatDateTime(order.createdAt)}
                  </p>
                  <p className="text-sm line-clamp-2">
                    {order.items.map(item => `${item.quantity}x ${item.product.name}`).join(', ')}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold">{formatCurrency(order.total)}</p>
                <ArrowRight className="h-4 w-4 text-muted-foreground mt-2 ml-auto" />
              </div>
            </div>

            {/* Linha do tempo só para pedidos em andamento */}
            {!pedidoEncerrado(order.status) && (
              <div className="mt-4 pt-4 border-t border-border overflow-x-auto">
                <OrderProgress status={order.status} />
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
