'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  CreditCard,
  Banknote,
  QrCode,
  ClipboardList,
  ShoppingBag,
  CheckCircle2,
  Store,
  Truck,
  Coffee
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { ClientLayout } from '@/components/client-layout'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { showError } from '@/lib/api'
import { formatCurrency } from '@/lib/format'
import type { TipoPedidoSite } from '@/lib/adapters'
import type { PaymentMethod } from '@/lib/types'
import { cn } from '@/lib/utils'

const paymentMethods: { value: PaymentMethod; label: string; icon: typeof CreditCard; description: string }[] = [
  { value: 'pix', label: 'PIX', icon: QrCode, description: 'QR Code no balcão' },
  { value: 'credit', label: 'Cartão de Crédito', icon: CreditCard, description: 'Na maquininha, no balcão' },
  { value: 'debit', label: 'Cartão de Débito', icon: CreditCard, description: 'Na maquininha, no balcão' },
  { value: 'cash', label: 'Dinheiro', icon: Banknote, description: 'Pague no balcão' },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { user, isLoading: carregandoSessao } = useAuth()
  const { items, total, isLoading: carregandoCarrinho, finalizarPedido } = useCart()

  const [deliveryType, setDeliveryType] = useState<TipoPedidoSite>('pickup')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix')
  const [orderNotes, setOrderNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState<number | null>(null)

  // Checkout só com login: volta pra cá depois de entrar
  useEffect(() => {
    if (!carregandoSessao && !user) router.replace('/auth?voltar=/checkout')
  }, [carregandoSessao, user, router])

  const handlePlaceOrder = async () => {
    if (isProcessing) return
    setIsProcessing(true)
    try {
      const pedido = await finalizarPedido({
        formaPagamento: paymentMethod,
        tipoPedido: deliveryType,
        observacao: orderNotes,
      })
      setOrderId(pedido.id)
      setOrderComplete(true)
    } catch {
      // o erro já apareceu num toast (ex.: produto ficou indisponível)
    } finally {
      setIsProcessing(false)
    }
  }

  if (carregandoSessao || !user || (carregandoCarrinho && !orderComplete)) {
    return (
      <ClientLayout>
        <div className="container px-4 py-24 flex justify-center">
          <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </ClientLayout>
    )
  }

  // (isProcessing: o carrinho esvazia um instante antes da tela de confirmado aparecer)
  if (items.length === 0 && !orderComplete && !isProcessing) {
    return (
      <ClientLayout>
        <div className="container px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h1>
            <p className="text-muted-foreground mb-6">
              Adicione itens ao carrinho para continuar com o checkout
            </p>
            <Button asChild>
              <Link href="/menu">Ver Cardápio</Link>
            </Button>
          </div>
        </div>
      </ClientLayout>
    )
  }

  if (orderComplete) {
    return (
      <ClientLayout>
        <div className="container px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center"
          >
            <div className="h-20 w-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="font-serif text-3xl font-bold mb-2">Pedido enviado!</h1>
            <p className="text-muted-foreground mb-6">
              Recebemos seu pedido. Agora é só aguardar a confirmação do café.
            </p>
            
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Número do pedido</div>
                <div className="text-2xl font-bold font-mono">#{orderId}</div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-8">
              <ClipboardList className="h-4 w-4" />
              <span>Acompanhe o andamento em Meus Pedidos</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href={`/pedidos/${orderId}`}>
                  Acompanhar Pedido
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/menu">
                  Continuar Comprando
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </ClientLayout>
    )
  }

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
              <h1 className="font-serif text-xl font-bold">Finalizar Pedido</h1>
            </div>
          </div>
        </div>

        <div className="container px-4 py-8 md:px-6">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Type */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tipo de Entrega</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={deliveryType}
                    onValueChange={(value) => setDeliveryType(value as TipoPedidoSite)}
                    className="grid grid-cols-3 gap-4"
                  >
                    {([
                      { value: 'pickup', label: 'Retirar na loja', icon: Store },
                      { value: 'dine-in', label: 'Consumir no café', icon: Coffee },
                    ] as const).map((tipo) => (
                      <Label
                        key={tipo.value}
                        htmlFor={tipo.value}
                        className={cn(
                          'flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-colors text-center',
                          deliveryType === tipo.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <RadioGroupItem value={tipo.value} id={tipo.value} className="sr-only" />
                        <tipo.icon className="h-6 w-6" />
                        <span className="font-medium">{tipo.label}</span>
                        <span className="text-xs text-muted-foreground">Grátis</span>
                      </Label>
                    ))}
                    {/* Entrega ainda não existe no back */}
                    <div className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-border text-center opacity-60 cursor-not-allowed">
                      <Truck className="h-6 w-6" />
                      <span className="font-medium text-sm">Entrega</span>
                      <span className="text-xs text-muted-foreground">Em breve</span>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Forma de Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                    className="space-y-3"
                  >
                    {paymentMethods.map((method) => (
                      <Label
                        key={method.value}
                        htmlFor={method.value}
                        className={cn(
                          'flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors',
                          paymentMethod === method.value 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <RadioGroupItem value={method.value} id={method.value} />
                        <method.icon className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="font-medium">{method.label}</div>
                          <div className="text-xs text-muted-foreground">{method.description}</div>
                        </div>
                      </Label>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Order Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Observações do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Ex.: sem açúcar, leite sem lactose..."
                    maxLength={500}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="resize-none"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id ?? item.product.id} className="flex justify-between gap-2 text-sm">
                        <span>
                          {item.quantity}x {item.product.name}
                        </span>
                        <span className="shrink-0">{formatCurrency(item.subtotal ?? item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Processando...
                      </div>
                    ) : (
                      `Confirmar Pedido`
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    O pagamento é feito no balcão, na retirada ou no consumo.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}
