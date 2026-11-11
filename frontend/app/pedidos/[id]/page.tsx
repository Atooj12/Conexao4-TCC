'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Package, 
  ChefHat,
  Truck,
  MapPin,
  Phone,
  CreditCard,
  Coffee,
  MessageCircle,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ClientLayout } from '@/components/client-layout'
import { formatCurrency, formatDateTime, formatTime } from '@/lib/mock-data'
import { getOrderById } from '@/lib/orders-store'
import { orderStatusLabels, paymentMethodLabels, type OrderStatus, type Order } from '@/lib/types'
import { cn } from '@/lib/utils'

const statusConfig: Record<OrderStatus, { icon: typeof Clock; color: string; bgColor: string }> = {
  pending: { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  confirmed: { icon: CheckCircle2, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  preparing: { icon: ChefHat, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  ready: { icon: Package, color: 'text-green-600', bgColor: 'bg-green-100' },
  delivered: { icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-100' },
  cancelled: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
}

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params)
  const router = useRouter()

  const [order, setOrder] = useState<Order | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setOrder(getOrderById(id))
    setLoading(false)
  }, [id])

  if (loading) {
    return (
      <ClientLayout>
        <div className="container px-4 py-32 text-center flex flex-col items-center justify-center">
          <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground">Carregando detalhes do pedido...</p>
        </div>
      </ClientLayout>
    )
  }

  if (!order) {
    return (
      <ClientLayout>
        <div className="container px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Pedido não encontrado</h1>
          <p className="text-muted-foreground mb-6">
            O pedido que você está procurando não existe
          </p>
          <Button asChild>
            <Link href="/pedidos">Ver meus pedidos</Link>
          </Button>
        </div>
      </ClientLayout>
    )
  }

  const config = statusConfig[order.status]
  const StatusIcon = config.icon
  const isActive = ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status)

  return (
    <ClientLayout>
      <div className="min-h-screen bg-secondary/20">
        {/* Header */}
        <div className="bg-background border-b border-border">
          <div className="container px-4 py-4 md:px-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-serif text-xl font-bold">Pedido {order.id}</h1>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(order.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container px-4 py-8 md:px-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={cn('p-4 rounded-full', config.bgColor)}>
                      <StatusIcon className={cn('h-8 w-8', config.color)} />
                    </div>
                    <div>
                      <Badge variant="outline" className={cn('mb-1', config.color)}>
                        {orderStatusLabels[order.status]}
                      </Badge>
                      <p className="text-muted-foreground">
                        {isActive
                          ? 'Seu pedido está sendo preparado'
                          : order.status === 'delivered'
                          ? 'Pedido entregue com sucesso'
                          : 'Pedido cancelado'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  {isActive && (
                    <>
                      <OrderProgress status={order.status} />
                      {order.estimatedDelivery && (
                        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>
                            Previsão: {formatTime(order.estimatedDelivery)}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Itens do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <Coffee className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium">{item.product.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Qtd: {item.quantity} x {formatCurrency(item.product.price)}
                          </p>
                          {item.notes && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Obs: {item.notes}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-medium">
                            {formatCurrency(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Taxa de serviço</span>
                      <span>{formatCurrency(order.tax)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Delivery Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações da Entrega</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">
                        {order.orderType === 'pickup' 
                          ? 'Retirada na loja' 
                          : order.orderType === 'dine-in'
                          ? 'Consumo no local'
                          : 'Entrega'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.orderType === 'pickup'
                          ? 'Retirada na cafeteria Conexão 4'
                          : order.orderType === 'dine-in'
                          ? `Mesa ${order.tableNumber || 'não especificada'}`
                          : order.deliveryAddress
                          ? `${order.deliveryAddress.street}, ${order.deliveryAddress.number}${order.deliveryAddress.complement ? ` - ${order.deliveryAddress.complement}` : ''} - ${order.deliveryAddress.neighborhood}, ${order.deliveryAddress.city}`
                          : 'Rua das Flores, 123 - Jardim Paulista, São Paulo'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Contato</p>
                      <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Pagamento</p>
                      <p className="text-sm text-muted-foreground">
                        {paymentMethodLabels[order.paymentMethod]}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button variant="outline" className="flex-1 gap-2">
                <MessageCircle className="h-4 w-4" />
                Falar com a loja
              </Button>
              {isActive ? (
                <Button variant="destructive" className="flex-1">
                  Cancelar pedido
                </Button>
              ) : (
                <Button className="flex-1 gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Pedir novamente
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </ClientLayout>
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
                  'h-10 w-10 rounded-full flex items-center justify-center transition-colors',
                  isComplete
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <StepIcon className="h-5 w-5" />
              </div>
              <span
                className={cn(
                  'text-xs mt-2 text-center',
                  isCurrent ? 'font-medium' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2 mt-[-20px]',
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
