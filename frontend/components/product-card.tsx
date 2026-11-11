'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Plus, Clock, Coffee } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '@/lib/cart-context'
import type { Product } from '@/lib/types'
import { formatCurrency } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/menu/${product.id}`}>
        <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg bg-card">
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent" />
                <div className="h-full w-full flex items-center justify-center">
                  <Coffee className="h-16 w-16 text-muted-foreground/30 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </>
            )}
            
            {/* Availability badge */}
            {!product.available && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <Badge variant="secondary" className="text-sm">
                  Indisponível
                </Badge>
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                {product.tags.slice(0, 2).map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="text-[10px] bg-background/90 backdrop-blur-sm"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Quick add button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1 }}
              className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Button
                size="icon"
                className="h-10 w-10 rounded-full shadow-lg"
                onClick={handleAddToCart}
                disabled={!product.available}
              >
                <Plus className="h-5 w-5" />
                <span className="sr-only">Adicionar ao carrinho</span>
              </Button>
            </motion.div>
          </div>

          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-serif font-semibold text-base truncate group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {product.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{product.preparationTime} min</span>
              </div>
              <span className="font-semibold text-primary">
                {formatCurrency(product.price)}
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] bg-muted animate-pulse" />
      <CardContent className="p-4 space-y-3">
        <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
        <div className="h-4 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="h-4 w-16 bg-muted rounded animate-pulse" />
          <div className="h-5 w-20 bg-muted rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}
