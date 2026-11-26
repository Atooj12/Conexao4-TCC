'use client'

import { use, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Coffee,
  CreditCard,
  MessageSquare,
  RefreshCw,
  Store,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { ClientLayout } from '@/components/client-layout'
import { OrderProgress, StatusBadge, statusConfig } from '@/components/pedido-status'
import { useExigirLogin } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'
import { ApiError, showError } from '@/lib/api'
import { pedidoEncerrado } from '@/lib/adapters'
import { buscarPedido, cancelarPedido } from '@/lib/pedidos'
import { useIntervalo } from '@/lib/use-intervalo'
import { formatCurrency, formatDateTime } from '@/lib/format'
import { paymentMethodLabels, type Order } from '@/lib/types'
import { cn } from '@/lib/utils'

const tipoPedidoTexto: Record<Order['orderType'], string> = {
  'pickup': 'Retirar na loja',
  'dine-in': 'Consumir no café',
  'delivery': 'Entrega',
}

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { pronto } = useExigirLogin(`/pedidos/${id}`)
  const { repetirPedido, isBusy } = useCart()

  const [order, setOrder] = useState<Order | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [naoEncontrado, setNaoEncontrado] = useState(false)
  const [cancelando, setCancelando] = useState(false)

  const carregar = useCallback(async (silencioso = false) => {
    try {
      setOrder(await buscarPedido(id))
      setErro(null)
    } catch (err) {
      // 404: não existe; 403: é de outra pessoa; 400: o id da URL nem é número. Em todos, "não encontrado".
      if (err instanceof ApiError && [400, 403, 404].includes(err.status)) setNaoEncontrado(true)
      else if (!silencioso) setErro(err instanceof Error ? err.message : 'Não foi possível carregar o pedido.')
    } finally {
      setCarregando(false)
    }
  }, [id])

  useEffect(() => {
    if (pronto) carregar()
  }, [pronto, carregar])

  // Enquanto o pedido não termina, confere o status a cada 15 s (igual ao app)
  useIntervalo(() => carregar(true), 15000, pronto && !!order && !pedidoEncerrado(order.status))

  const cancelar = async () => {
    setCancelando(true)
    try {
      setOrder(await cancelarPedido(id))
      toast.success('Pedido cancelado')
    } catch (err) {
      showError(err) // ex.: o café já confirmou o pedido
      carregar(true)
    } finally {
      setCancelando(false)
    }
  }

  if (!pronto || carregando) {
    return (
      <ClientLayout>
        <div className="container px-4 py-32 text-center flex flex-col items-center justify-center">
          <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground">Carregando detalhes do pedido...</p>
        </div>
      </ClientLayout>
    )
  }

  if (naoEncontrado || (!order && !erro)) {
    return (
      <ClientLayout>
        <div className="container px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Pedido não encontrado</h1>
          <p className="text-muted-foreground mb-6">
            Esse pedido não existe ou não é da sua conta
          </p>
          <Button asChild>
            <Link href="/pedidos">Ver meus pedidos</Link>
          </Button>
        </div>
      </ClientLayout>
    )
  }

  if (!order) {
    return (
      <ClientLayout>
        <div className="container px-4 py-16 text-center">
          <p className="font-medium mb-1">Não foi possível carregar o pedido</p>
          <p className="text-sm text-muted-foreground mb-4">{erro}</p>
          <Button variant="outline" className="gap-2" onClick={() => { setCarregando(true); carregar() }}>
            <RefreshCw className="h-4 w-4" />
            Tentar de novo
          </Button>
        </div>
      </ClientLayout>
    )
  }

  const config = statusConfig[order.status]
  const StatusIcon = config.icon

  return (
    <ClientLayout>
      <div className="min-h-screen bg-secondary/20">
        {/* Header */}
        <div className="bg-background border-b border-border">
          <div className="container px-4 py-4 md:px-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push('/pedidos')}>
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Voltar para meus pedidos</span>
              </Button>
              <div>
                <h1 className="font-serif text-xl font-bold">Pedido #{order.id}</h1>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(order.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container px-4 py-8 md:px-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className={cn('flex items-center gap-4', order.status !== 'cancelled' && 'mb-6')}>
                    <div className={cn('p-4 rounded-full', config.bgColor)}>
                      <StatusIcon className={cn('h-8 w-8', config.color)} />
                    </div>
                    <div>
                      <StatusBadge status={order.status} className="mb-1" />
                      <p className="text-muted-foreground">{config.texto}</p>
                    </div>
                  </div>

                  {order.status !== 'cancelled' && (
                    <div className="overflow-x-auto">
                      <OrderProgress status={order.status} size="lg" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Itens */}
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
                      <div key={item.id ?? item.product.id} className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0">
                          {item.product.image ? (
                            <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="64px" />
                          ) : (
                            <Coffee className="h-8 w-8 text-muted-foreground/50" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium">{item.product.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x {formatCurrency(item.product.price)}
                          </p>
                        </div>
                        <span className="font-medium shrink-0">
                          {formatCurrency(item.subtotal ?? item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Informações */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Store className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">{tipoPedidoTexto[order.orderType]}</p>
                      <p className="text-sm text-muted-foreground">Conexão 4 Café & Bistrô</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Pagamento</p>
                      <p className="text-sm text-muted-foreground">
                        {paymentMethodLabels[order.paymentMethod]} (no balcão)
                      </p>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="flex items-start gap-3">
                      <MessageSquare className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Observação</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{order.notes}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Ações */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {/* O back só deixa cancelar enquanto o pedido está Pendente */}
              {order.status === 'pending' && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex-1 gap-2" disabled={cancelando}>
                      <XCircle className="h-4 w-4" />
                      {cancelando ? 'Cancelando...' : 'Cancelar pedido'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancelar o pedido #{order.id}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Dá para cancelar enquanto o café ainda não confirmou. Depois disso não tem volta.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Voltar</AlertDialogCancel>
                      <AlertDialogAction onClick={cancelar}>Cancelar pedido</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              {pedidoEncerrado(order.status) && (
                <Button className="flex-1 gap-2" disabled={isBusy} onClick={() => repetirPedido(order.items)}>
                  <RefreshCw className="h-4 w-4" />
                  Pedir novamente
                </Button>
              )}
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/pedidos">Ver todos os pedidos</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}
