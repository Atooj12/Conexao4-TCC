'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Banknote, 
  QrCode,
  Clock,
  ShoppingBag,
  CheckCircle2,
  Store,
  Truck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { ClientLayout } from '@/components/client-layout'
import { useCart } from '@/lib/cart-context'
import { formatCurrency, mockUser } from '@/lib/mock-data'
import type { PaymentMethod } from '@/lib/types'
import { cn } from '@/lib/utils'
import { addOrder } from '@/lib/orders-store'

const paymentMethods: { value: PaymentMethod; label: string; icon: typeof CreditCard; description: string }[] = [
  { value: 'pix', label: 'PIX', icon: QrCode, description: 'Pagamento instantâneo' },
  { value: 'credit', label: 'Cartão de Crédito', icon: CreditCard, description: 'Até 3x sem juros' },
  { value: 'debit', label: 'Cartão de Débito', icon: CreditCard, description: 'Débito à vista' },
  { value: 'cash', label: 'Dinheiro', icon: Banknote, description: 'Pague na entrega' },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, tax, total, clearCart } = useCart()
  
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup')
  const [selectedAddress, setSelectedAddress] = useState(mockUser.addresses[0]?.id || '')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix')
  const [orderNotes, setOrderNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState('')

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const newOrderId = `C4-${Math.floor(1000 + Math.random() * 9000)}`
    
    const deliveryAddressObj = deliveryType === 'delivery' 
      ? mockUser.addresses.find(a => a.id === selectedAddress) 
      : undefined

    const newOrder = {
      id: newOrderId,
      items: [...items],
      status: 'confirmed' as const,
      subtotal,
      tax,
      total: total + (deliveryType === 'delivery' ? 5 : 0),
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 20 * 60000),
      customerName: mockUser.name || 'Cliente Demo',
      customerPhone: mockUser.phone || '(11) 99999-9999',
      paymentMethod,
      orderType: deliveryType,
      deliveryAddress: deliveryAddressObj,
    }

    addOrder(newOrder)
    
    setOrderId(newOrderId)
    setOrderComplete(true)
    clearCart()
    setIsProcessing(false)
  }

  if (items.length === 0 && !orderComplete) {
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
            <h1 className="font-serif text-3xl font-bold mb-2">Pedido Confirmado!</h1>
            <p className="text-muted-foreground mb-6">
              Seu pedido foi recebido e está sendo preparado
            </p>
            
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Número do pedido</div>
                <div className="text-2xl font-bold font-mono">{orderId}</div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-8">
              <Clock className="h-4 w-4" />
              <span>Tempo estimado: 15-25 minutos</span>
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
                    onValueChange={(value) => setDeliveryType(value as 'pickup' | 'delivery')}
                    className="grid grid-cols-2 gap-4"
                  >
                    <Label
                      htmlFor="pickup"
                      className={cn(
                        'flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-colors',
                        deliveryType === 'pickup' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <RadioGroupItem value="pickup" id="pickup" className="sr-only" />
                      <Store className="h-6 w-6" />
                      <span className="font-medium">Retirar na Loja</span>
                      <span className="text-xs text-muted-foreground">Grátis</span>
                    </Label>
                    <Label
                      htmlFor="delivery"
                      className={cn(
                        'flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-colors',
                        deliveryType === 'delivery' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <RadioGroupItem value="delivery" id="delivery" className="sr-only" />
                      <Truck className="h-6 w-6" />
                      <span className="font-medium">Entrega</span>
                      <span className="text-xs text-muted-foreground">A partir de R$ 5,00</span>
                    </Label>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Address (if delivery) */}
              {deliveryType === 'delivery' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Endereço de Entrega
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup
                        value={selectedAddress}
                        onValueChange={setSelectedAddress}
                        className="space-y-3"
                      >
                        {mockUser.addresses.map((address) => (
                          <Label
                            key={address.id}
                            htmlFor={address.id}
                            className={cn(
                              'flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors',
                              selectedAddress === address.id 
                                ? 'border-primary bg-primary/5' 
                                : 'border-border hover:border-primary/50'
                            )}
                          >
                            <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                            <div>
                              <div className="font-medium">{address.label}</div>
                              <div className="text-sm text-muted-foreground">
                                {address.street}, {address.number}
                                {address.complement && ` - ${address.complement}`}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {address.neighborhood}, {address.city} - {address.state}
                              </div>
                            </div>
                          </Label>
                        ))}
                      </RadioGroup>
                      <Button variant="outline" className="mt-4 w-full">
                        Adicionar novo endereço
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

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
                    placeholder="Alguma instrução especial para o seu pedido?"
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
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x {item.product.name}
                        </span>
                        <span>{formatCurrency(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Taxa de serviço</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                    {deliveryType === 'delivery' && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Entrega</span>
                        <span>{formatCurrency(5)}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(total + (deliveryType === 'delivery' ? 5 : 0))}</span>
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
                    Ao confirmar, você concorda com nossos termos de serviço
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
