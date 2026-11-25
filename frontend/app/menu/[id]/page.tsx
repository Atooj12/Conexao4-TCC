'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  ShoppingBag,
  Coffee
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ClientLayout } from '@/components/client-layout'
import { ProductCard, CardapioErro } from '@/components/product-card'
import { useCart } from '@/lib/cart-context'
import { formatCurrency } from '@/lib/format'
import { useProdutos } from '@/lib/use-produtos'
import { categoryLabels } from '@/lib/types'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { addItem, setCartOpen } = useCart()
  
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const { produtos: products, carregando, erro, recarregar } = useProdutos()

  const product = products.find(p => p.id === id)

  if (carregando) {
    return (
      <ClientLayout>
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="aspect-square rounded-2xl bg-muted animate-pulse" />
            <div className="space-y-4">
              <div className="h-6 w-24 bg-muted rounded animate-pulse" />
              <div className="h-10 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-5 bg-muted rounded animate-pulse" />
              <div className="h-8 w-32 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </ClientLayout>
    )
  }

  if (erro) {
    return (
      <ClientLayout>
        <div className="container px-4 py-8">
          <CardapioErro mensagem={erro} onTentarDeNovo={recarregar} />
        </div>
      </ClientLayout>
    )
  }

  if (!product) {
    return (
      <ClientLayout>
        <div className="container px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <Button asChild>
            <Link href="/menu">Voltar ao cardápio</Link>
          </Button>
        </div>
      </ClientLayout>
    )
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const handleAddToCart = () => {
    addItem(product, quantity, notes || undefined)
    setCartOpen(true)
  }

  const incrementQuantity = () => setQuantity(q => q + 1)
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1))

  return (
    <ClientLayout>
      <div className="min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-secondary/30 border-b border-border">
          <div className="container px-4 py-4 md:px-6">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/menu" className="text-muted-foreground hover:text-foreground transition-colors">
                Cardápio
              </Link>
              <span className="text-muted-foreground">/</span>
              <Link 
                href={`/menu?categoria=${product.category}`} 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {categoryLabels[product.category]}
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="container px-4 py-8 md:px-6 md:py-12">
          {/* Back button (mobile) */}
          <Button 
            variant="ghost" 
            className="mb-6 md:hidden gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent" />
                    <div className="h-full w-full flex items-center justify-center">
                      <Coffee className="h-32 w-32 text-muted-foreground/30" />
                    </div>
                  </>
                )}
                
                {!product.available && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <Badge variant="destructive" className="text-lg py-2 px-4">
                      Indisponível
                    </Badge>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <div className="mb-2">
                <Badge variant="outline">{categoryLabels[product.category]}</Badge>
              </div>

              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                {product.name}
              </h1>

              <p className="text-muted-foreground text-lg mb-6">
                {product.description}
              </p>

              <div className="text-3xl font-bold text-primary mb-6">
                {formatCurrency(product.price)}
              </div>

              <Separator className="mb-6" />

              {/* Notes */}
              <div className="mb-6">
                <Label htmlFor="notes" className="mb-2 block">
                  Observações (opcional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Ex: Sem açúcar, leite de aveia..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="resize-none"
                />
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={incrementQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button 
                  className="flex-1 gap-2" 
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!product.available}
                >
                  <ShoppingBag className="h-5 w-5" />
                  Adicionar ao carrinho
                  <span className="ml-2">{formatCurrency(product.price * quantity)}</span>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="font-serif text-2xl font-bold mb-6">
                Você também pode gostar
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </ClientLayout>
  )
}
