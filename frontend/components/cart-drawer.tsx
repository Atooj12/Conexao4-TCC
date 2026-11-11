'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useCart } from '@/lib/cart-context'
import { formatCurrency } from '@/lib/mock-data'

export function CartDrawer() {
  const { 
    items, 
    isOpen, 
    setCartOpen, 
    removeItem, 
    updateQuantity,
    subtotal,
    tax,
    total,
    itemCount 
  } = useCart()

  return (
    <Sheet open={isOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-md bg-background flex flex-col">
        <SheetHeader className="space-y-1">
          <SheetTitle className="font-serif text-xl flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Seu Carrinho
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            {itemCount === 0 
              ? 'Seu carrinho está vazio' 
              : `${itemCount} ${itemCount === 1 ? 'item' : 'itens'} no carrinho`
            }
          </p>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
            <div className="rounded-full bg-muted p-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="font-medium">Carrinho vazio</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Adicione itens do cardápio para começar
              </p>
            </div>
            <Button asChild onClick={() => setCartOpen(false)}>
              <Link href="/menu">Ver Cardápio</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="py-4 first:pt-0"
                  >
                    <div className="flex gap-4">
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                        <div className="h-full w-full flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {formatCurrency(item.product.price)}
                        </p>
                        {item.notes && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            Obs: {item.notes}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => removeItem(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-medium text-sm">
                          {formatCurrency(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                    <Separator className="mt-4" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </ScrollArea>

            <div className="border-t border-border pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de serviço (10%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-lg">{formatCurrency(total)}</span>
                </div>
              </div>

              <Button 
                asChild 
                className="w-full" 
                size="lg"
                onClick={() => setCartOpen(false)}
              >
                <Link href="/checkout">
                  Finalizar Pedido
                </Link>
              </Button>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setCartOpen(false)}
              >
                Continuar Comprando
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
