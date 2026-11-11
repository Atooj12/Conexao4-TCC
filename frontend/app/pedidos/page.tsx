'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Package, 
  ChefHat,
  Coffee,
  Truck,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ClientLayout } from '@/components/client-layout'
import { formatCurrency, formatDateTime } from '@/lib/mock-data'
import { getOrders } from '@/lib/orders-store'
import { orderStatusLabels, type OrderStatus, type Order } from '@/lib/types'
import { cn } from '@/lib/utils'

const statusConfig: Record<OrderStatus, { icon: typeof Clock; color: string; bgColor: string }> = {
  pending: { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  confirmed: { icon: CheckCircle2, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  preparing: { icon: ChefHat, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  ready: { icon: Package, color: 'text-green-600', bgColor: 'bg-green-100' },
  delivered: { icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-100' },
  cancelled: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    setOrders(getOrders())
  }, [])

  const activeOrders = orders.filter(o => 
    ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)
  )
  const completedOrders = orders.filter(o => 
    ['delivered', 'cancelled'].includes(o.status)
  )

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
                Acompanhe seus pedidos em tempo real
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container px-4 py-8 md:px-6">
          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
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

            <TabsContent value="active">
              {activeOrders.length === 0 ? (
                <EmptyState
                  title="Nenhum pedido em andamento"
                  description="Faça um pedido e acompanhe aqui"
                />
              ) : (
                <div className="space-y-4">
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
                  description="Seus pedidos anteriores aparecerão aqui"
                />
              ) : (
                <div className="space-y-4">
                  {completedOrders.map((order, index) => (
                    <OrderCard key={order.id} order={order} index={index} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
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
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/pedidos/${order.id}`}>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={cn('p-3 rounded-full', config.bgColor)}>
                  <StatusIcon className={cn('h-5 w-5', config.color)} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-medium">{order.id}</span>
                    <Badge variant="outline" className={cn('text-xs', config.color)}>
                      {orderStatusLabels[order.status]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {formatDateTime(order.createdAt)}
                  </p>
                  <div className="text-sm">
                    {order.items.map((item, i) => (
                      <span key={item.product.id}>
                        {item.quantity}x {item.product.name}
                        {i < order.items.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(order.total)}</p>
                <ArrowRight className="h-4 w-4 text-muted-foreground mt-2 ml-auto" />
              </div>
            </div>

            {/* Progress for active orders */}
            {['pending', 'confirmed', 'preparing', 'ready'].includes(order.status) && (
              <div className="mt-4 pt-4 border-t border-border">
                <OrderProgress status={order.status} />
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

function OrderProgress({ status }: { status: OrderStatus }) {
  const steps = [
    { key: 'confirmed', label: 'Pedido confirmado', icon: CheckCircle2 },
    { key: 'preparing', label: 'Em preparo', icon: ChefHat },
    { key: 'ready', label: 'Saiu para entrega', icon: Truck },
    { key: 'delivered', label: 'Entregue', icon: Package },
  ]

  const currentIndex = steps.findIndex(s => s.key === status)
  const adjustedIndex = status === 'pending' ? -1 : currentIndex

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const isComplete = index <= adjustedIndex
        const isCurrent = index === adjustedIndex
        const StepIcon = step.icon

        return (
          <div key={step.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center transition-colors',
                  isComplete
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <StepIcon className="h-4 w-4" />
              </div>
              <span
                className={cn(
                  'text-xs mt-1',
                  isCurrent ? 'font-medium' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2',
                  index < adjustedIndex ? 'bg-primary' : 'bg-muted'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
