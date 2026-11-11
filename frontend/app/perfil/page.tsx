'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Heart, 
  Gift, 
  Settings, 
  LogOut,
  ChevronRight,
  Edit2,
  Plus,
  Star,
  Coffee
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { ClientLayout } from '@/components/client-layout'
import { mockUser, products, formatCurrency } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const menuItems = [
  { icon: MapPin, label: 'Meus Endereços', href: '/perfil/enderecos' },
  { icon: Heart, label: 'Favoritos', href: '/perfil/favoritos' },
  { icon: Gift, label: 'Programa Fidelidade', href: '/perfil/fidelidade' },
  { icon: Settings, label: 'Configurações', href: '/perfil/configuracoes' },
]

export default function ProfilePage() {
  const user = mockUser
  const favoriteProducts = products.filter(p => user.favoriteProducts.includes(p.id))
  const pointsToNextReward = 500 - (user.loyaltyPoints % 500)
  const progressToReward = ((user.loyaltyPoints % 500) / 500) * 100

  return (
    <ClientLayout>
      <div className="min-h-screen">
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground pb-24 pt-12">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <h1 className="font-serif text-2xl font-bold">Meu Perfil</h1>
              <Button variant="ghost" size="icon" className="text-primary-foreground">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="container px-4 md:px-6 -mt-16">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                      <h2 className="text-xl font-bold">{user.name}</h2>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2 mb-1">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </p>
                    <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                      <Phone className="h-4 w-4" />
                      {user.phone}
                    </p>
                  </div>

                  <div className="text-center sm:text-right">
                    <Badge className="bg-accent text-accent-foreground mb-2">
                      <Star className="h-3 w-3 mr-1" />
                      Cliente VIP
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Desde Jan/2024
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Loyalty Points */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Gift className="h-5 w-5 text-accent" />
                    Programa Fidelidade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-primary mb-1">
                      {user.loyaltyPoints}
                    </div>
                    <p className="text-sm text-muted-foreground">pontos acumulados</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Próxima recompensa</span>
                      <span className="font-medium">{pointsToNextReward} pts</span>
                    </div>
                    <Progress value={progressToReward} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      Ganhe um café grátis ao atingir 500 pontos
                    </p>
                  </div>

                  <Separator className="my-4" />

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <Coffee className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-lg font-bold">12</p>
                      <p className="text-xs text-muted-foreground">Cafés grátis</p>
                    </div>
                    <div>
                      <Gift className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-lg font-bold">3</p>
                      <p className="text-xs text-muted-foreground">Recompensas</p>
                    </div>
                    <div>
                      <Star className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-lg font-bold">47</p>
                      <p className="text-xs text-muted-foreground">Pedidos</p>
                    </div>
                  </div>

                  <Button className="w-full mt-4" variant="outline">
                    Ver recompensas disponíveis
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions & Addresses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Menu Items */}
              <Card>
                <CardContent className="p-0">
                  {menuItems.map((item, index) => (
                    <Link key={item.href} href={item.href}>
                      <div
                        className={cn(
                          'flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors',
                          index !== menuItems.length - 1 && 'border-b border-border'
                        )}
                      >
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <span className="flex-1 font-medium">{item.label}</span>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Addresses Preview */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Endereços</CardTitle>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Plus className="h-4 w-4" />
                      Adicionar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {user.addresses.slice(0, 2).map((address) => (
                      <div
                        key={address.id}
                        className={cn(
                          'flex items-start gap-3 p-3 rounded-lg border',
                          address.isDefault && 'border-primary bg-primary/5'
                        )}
                      >
                        <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{address.label}</span>
                            {address.isDefault && (
                              <Badge variant="secondary" className="text-xs">
                                Padrão
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {address.street}, {address.number}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Favorites */}
          {favoriteProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Heart className="h-5 w-5 text-destructive" />
                      Seus Favoritos
                    </CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/perfil/favoritos">Ver todos</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {favoriteProducts.map((product) => (
                      <Link key={product.id} href={`/menu/${product.id}`}>
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <Coffee className="h-6 w-6 text-muted-foreground/50" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{product.name}</p>
                            <p className="text-sm text-primary">{formatCurrency(product.price)}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Logout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 mb-8"
          >
            <Button variant="outline" className="w-full text-destructive hover:text-destructive gap-2">
              <LogOut className="h-4 w-4" />
              Sair da conta
            </Button>
          </motion.div>
        </div>
      </div>
    </ClientLayout>
  )
}
