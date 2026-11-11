'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Clock,
  Star,
  Coffee,
  Truck,
  Award,
  Users,
  CupSoda,
  Sandwich,
  CakeSlice,
  Croissant,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ClientLayout } from '@/components/client-layout'
import { ProductCard } from '@/components/product-card'
import { products } from '@/lib/mock-data'
import { categoryLabels, type Category } from '@/lib/types'

const categoryIcons: Record<Category, React.ElementType> = {
  'cafes': Coffee,
  'bebidas-geladas': CupSoda,
  'lanches': Sandwich,
  'doces': CakeSlice,
  'salgados': Croissant,
  'especiais': Sparkles,
}

const featuredProducts = products.slice(0, 4)
const categories = Object.entries(categoryLabels)

const features = [
  {
    icon: Coffee,
    title: 'Café Especial',
    description: 'Grãos selecionados das melhores fazendas brasileiras',
  },
  {
    icon: Truck,
    title: 'Entrega Rápida',
    description: 'Receba seu pedido quentinho em até 30 minutos',
  },
  {
    icon: Award,
    title: 'Qualidade Premium',
    description: 'Ingredientes frescos e preparação artesanal',
  },
  {
    icon: Users,
    title: 'Programa Fidelidade',
    description: 'Acumule pontos e ganhe recompensas exclusivas',
  },
]

export default function HomePage() {
  return (
    <ClientLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90">
        <div className="absolute inset-0 bg-[url('/images/coffee-beans.jpg')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />

        <div className="container relative px-4 py-20 md:py-32 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center lg:text-left"
            >
              <Badge className="mb-4 bg-accent text-accent-foreground">
                Novidade: Cold Brew 12h
              </Badge>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                Café de verdade,{' '}
                <span className="text-accent">experiência</span> única
              </h1>
              <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto lg:mx-0">
                Descubra o sabor autêntico do café brasileiro. Grãos selecionados,
                torra artesanal e preparação com amor em cada xícara.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/menu">
                    Ver Cardápio
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <p className="text-3xl font-bold text-primary-foreground">5K+</p>
                  <p className="text-sm text-primary-foreground/70">Clientes felizes</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-3xl font-bold text-primary-foreground">4.9</p>
                  <p className="text-sm text-primary-foreground/70">Avaliação média</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-3xl font-bold text-primary-foreground">20+</p>
                  <p className="text-sm text-primary-foreground/70">Bebidas especiais</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-accent/20 rounded-full blur-3xl" />
                <div className="relative bg-gradient-to-br from-accent/30 to-transparent rounded-full p-8 aspect-square flex items-center justify-center">
                  <img
                    src="/logo-circular.png"
                    alt="Logo Conexão 4"
                    className="h-150 w-150 object-contain opacity-90"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Explore nosso cardápio
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Do café tradicional aos lanches gourmet, temos opções para todos os momentos do seu dia
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(([key, label], index) => {
              const Icon = categoryIcons[key as Category] || Coffee
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/menu?categoria=${key}`}>
                    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/30 cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-medium text-sm">{label}</h3>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">
                Mais pedidos
              </h2>
              <p className="text-muted-foreground">
                Os favoritos dos nossos clientes
              </p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex">
              <Link href="/menu">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" asChild>
              <Link href="/menu">
                Ver todos os produtos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Por que escolher a Conexão 4?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Mais do que um café, uma experiência completa de sabor e aconchego
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="h-14 w-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <feature.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Pronto para experimentar?
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              Faça seu pedido agora e receba em minutos. Primeira compra com 10% de desconto!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/cadastro">
                  Criar conta grátis
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/menu">
                  Ver cardápio
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              O que nossos clientes dizem
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Ana Carolina',
                comment: 'O melhor café que já tomei! A entrega é super rápida e sempre chega quentinho.',
                rating: 5,
              },
              {
                name: 'Pedro Henrique',
                comment: 'Os croissants são incríveis, parecem que saíram de uma padaria parisiense.',
                rating: 5,
              },
              {
                name: 'Mariana Santos',
                comment: 'Adoro o programa de fidelidade! Já ganhei vários cafés grátis.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">
                      &ldquo;{testimonial.comment}&rdquo;
                    </p>
                    <p className="font-medium">{testimonial.name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </ClientLayout>
  )
}
