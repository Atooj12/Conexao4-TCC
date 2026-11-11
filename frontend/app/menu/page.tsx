'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Coffee, CupSoda, Sandwich, CakeSlice, Sparkles, Croissant, ChefHat, Utensils } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ClientLayout } from '@/components/client-layout'
import { ProductCard } from '@/components/product-card'
import { products } from '@/lib/mock-data'
import { categoryLabels, type Category } from '@/lib/types'
import { cn } from '@/lib/utils'

const categoryIcons: Record<Category, React.ElementType> = {
  'cafes': Coffee,
  'bebidas-geladas': CupSoda,
  'lanches': Sandwich,
  'doces': CakeSlice,
  'salgados': Croissant,
  'especiais': Sparkles,
}

const categoryDescriptions: Record<Category, string> = {
  'cafes': 'Cafes especiais preparados com graos selecionados',
  'bebidas-geladas': 'Refrescantes opcoes para qualquer momento',
  'lanches': 'Sanduiches e opcoes salgadas artesanais',
  'doces': 'Sobremesas irresistiveis feitas na casa',
  'salgados': 'Delicias salgadas para acompanhar seu cafe',
  'especiais': 'Criacacoes exclusivas do nosso barista',
}

export default function MenuPage() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('categoria') as Category | null

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(initialCategory)

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch = 
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tags.some(tag => tag.toLowerCase().includes(query))
        if (!matchesSearch) return false
      }

      if (selectedCategory && product.category !== selectedCategory) {
        return false
      }

      return true
    })
  }, [searchQuery, selectedCategory])

  const productsByCategory = useMemo(() => {
    if (selectedCategory) {
      return { [selectedCategory]: filteredProducts }
    }
    
    const grouped: Partial<Record<Category, typeof products>> = {}
    filteredProducts.forEach(product => {
      if (!grouped[product.category]) {
        grouped[product.category] = []
      }
      grouped[product.category]!.push(product)
    })
    return grouped
  }, [filteredProducts, selectedCategory])

  return (
    <ClientLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Header */}
        <div className="relative bg-gradient-to-br from-primary via-primary/95 to-accent/80 text-primary-foreground overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute bottom-10 right-20 w-48 h-48 rounded-full bg-accent/30 blur-3xl" />
          </div>
          <div className="container relative px-4 py-12 md:py-16 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                <ChefHat className="h-4 w-4" />
                <span className="text-sm font-medium">Feito com amor e cafe premium</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-balance">
                Nosso Cardapio
              </h1>
              <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
                Explore nossa selecao de cafes especiais, bebidas artesanais e delicias gastronomicas preparadas com ingredientes frescos
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container px-4 py-8 md:px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Categories */}
            <aside className="lg:w-72 shrink-0">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar no cardapio..."
                    className="pl-10 bg-card border-border/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Category Navigation */}
                <div className="bg-card rounded-xl border border-border/50 overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-border/50">
                    <h3 className="font-serif font-semibold text-lg">Categorias</h3>
                  </div>
                  <ScrollArea className="max-h-[400px] lg:max-h-none">
                    <nav className="p-2">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200',
                          selectedCategory === null
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'hover:bg-secondary text-foreground'
                        )}
                      >
                        <div className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center',
                          selectedCategory === null ? 'bg-white/20' : 'bg-primary/10'
                        )}>
                          <Utensils className={cn(
  'h-5 w-5',
  selectedCategory === null ? 'text-primary-foreground' : 'text-primary'
)} />
                        </div>
                        <div>
                          <span className="font-medium block">Todos os Itens</span>
                          <span className={cn(
                            'text-xs',
                            selectedCategory === null ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          )}>
                            {products.length} produtos
                          </span>
                        </div>
                      </button>

                      {Object.entries(categoryLabels).map(([key, label]) => {
                        const category = key as Category
                        const Icon = categoryIcons[category]
                        const count = products.filter(p => p.category === category).length

                        return (
                          <button
                            key={key}
                            onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                            className={cn(
                              'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 mt-1',
                              selectedCategory === category
                                ? 'bg-primary text-primary-foreground shadow-md'
                                : 'hover:bg-secondary text-foreground'
                            )}
                          >
                            <div className={cn(
                              'w-10 h-10 rounded-lg flex items-center justify-center',
                              selectedCategory === category ? 'bg-white/20' : 'bg-primary/10'
                            )}>
                              <Icon className={cn(
                                'h-5 w-5',
                                selectedCategory === category ? 'text-primary-foreground' : 'text-primary'
                              )} />
                            </div>
                            <div>
                              <span className="font-medium block">{label}</span>
                              <span className={cn(
                                'text-xs',
                                selectedCategory === category ? 'text-primary-foreground/70' : 'text-muted-foreground'
                              )}>
                                {count} {count === 1 ? 'item' : 'itens'}
                              </span>
                            </div>
                          </button>
                        )
                      })}
                    </nav>
                  </ScrollArea>
                </div>

                {/* Info Card */}
                <div className="hidden lg:block bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl p-5 border border-accent/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Coffee className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <h4 className="font-serif font-semibold">Cafe Fresco</h4>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Todos os nossos cafes sao preparados na hora com graos torrados semanalmente.
                  </p>
                </div>
              </div>
            </aside>

            {/* Main Content - Products */}
            <main className="flex-1 min-w-0">
              {/* Results info */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  {selectedCategory ? (
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="gap-2 py-1.5 px-3">
                        {categoryLabels[selectedCategory]}
                        <button onClick={() => setSelectedCategory(null)} className="hover:text-primary">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    </div>
                  ) : searchQuery ? (
                    <p className="text-muted-foreground">
                      Resultados para &quot;{searchQuery}&quot;
                    </p>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'produto' : 'produtos'}
                </p>
              </div>

              {/* Products by Category */}
              <AnimatePresence mode="popLayout">
                {Object.keys(productsByCategory).length > 0 ? (
                  <div className="space-y-12">
                    {Object.entries(productsByCategory).map(([category, categoryProducts]) => {
                      if (!categoryProducts || categoryProducts.length === 0) return null
                      const cat = category as Category
                      const Icon = categoryIcons[cat]

                      return (
                        <motion.section
                          key={category}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          {!selectedCategory && (
                            <div className="mb-6">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <h2 className="font-serif text-2xl font-bold">{categoryLabels[cat]}</h2>
                                  <p className="text-sm text-muted-foreground">{categoryDescriptions[cat]}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                            {categoryProducts.map((product, index) => (
                              <ProductCard key={product.id} product={product} index={index} />
                            ))}
                          </div>
                        </motion.section>
                      )
                    })}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                  >
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                      <Coffee className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="font-serif font-semibold text-xl mb-2">
                      Nenhum produto encontrado
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                      Tente buscar por outro termo ou explore nossas categorias
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchQuery('')
                        setSelectedCategory(null)
                      }}
                    >
                      Ver todos os produtos
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}
