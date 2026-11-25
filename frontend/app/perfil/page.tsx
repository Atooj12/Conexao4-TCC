'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ChevronRight,
  ClipboardList,
  Gift,
  Heart,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Settings,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ClientLayout } from '@/components/client-layout'
import { StatusBadge } from '@/components/pedido-status'
import { useAuth, useExigirLogin, nomeExibicao } from '@/lib/auth-context'
import { pedidoEncerrado } from '@/lib/adapters'
import { buscarMeusPedidos } from '@/lib/pedidos'
import { formatCurrency, formatDateTime } from '@/lib/format'
import type { Order } from '@/lib/types'

// Recursos planejados que o back ainda não tem
const emBreve = [
  { icon: Gift, label: 'Programa Fidelidade', descricao: 'Junte pontos a cada pedido' },
  { icon: MapPin, label: 'Endereços', descricao: 'Para quando tiver entrega' },
  { icon: Heart, label: 'Favoritos', descricao: 'Seus itens preferidos do cardápio' },
]

export default function ProfilePage() {
  const router = useRouter()
  const { user: usuario, pronto } = useExigirLogin('/perfil')
  const { isAdmin, logout } = useAuth()

  const [pedidos, setPedidos] = useState<Order[] | null>(null)

  useEffect(() => {
    if (!pronto) return
    buscarMeusPedidos().then(setPedidos).catch(() => setPedidos([]))
  }, [pronto])

  if (!pronto || !usuario) {
    return (
      <ClientLayout>
        <div className="container px-4 py-32 flex justify-center">
          <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </ClientLayout>
    )
  }

  const nome = nomeExibicao(usuario)
  const iniciais = nome.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join('')

  // Resumo calculado a partir dos pedidos reais (cancelados não contam no gasto)
  const emAndamento = pedidos?.filter(p => !pedidoEncerrado(p.status)).length ?? 0
  const totalGasto = pedidos?.filter(p => p.status !== 'cancelled').reduce((soma, p) => soma + p.total, 0) ?? 0
  const recentes = pedidos?.slice(0, 3) ?? []

  const sair = () => {
    logout()
    router.push('/')
  }

  return (
    <ClientLayout>
      <div className="min-h-screen">
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground pb-24 pt-12">
          <div className="container px-4 md:px-6">
            <h1 className="font-serif text-2xl font-bold mb-8">Meu Perfil</h1>
          </div>
        </div>

        <div className="container px-4 md:px-6 -mt-16">
          {/* Dados da conta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {iniciais}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl font-bold mb-1">{nome}</h2>
                    <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2 mb-1">
                      <Mail className="h-4 w-4" />
                      {usuario.email}
                    </p>
                    {usuario.phoneNumber && (
                      <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                        <Phone className="h-4 w-4" />
                        {usuario.phoneNumber}
                      </p>
                    )}
                  </div>

                  <Badge className={isAdmin ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'}>
                    {isAdmin ? 'Administrador' : 'Cliente'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Pedidos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    Seus pedidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pedidos === null ? (
                    <div className="space-y-3">
                      <div className="h-16 bg-muted rounded animate-pulse" />
                      <div className="h-12 bg-muted rounded animate-pulse" />
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-3 gap-4 text-center mb-6">
                        <div>
                          <p className="text-2xl font-bold text-primary">{pedidos.length}</p>
                          <p className="text-xs text-muted-foreground">Pedidos</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-primary">{emAndamento}</p>
                          <p className="text-xs text-muted-foreground">Em andamento</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-primary">{formatCurrency(totalGasto)}</p>
                          <p className="text-xs text-muted-foreground">Total gasto</p>
                        </div>
                      </div>

                      {recentes.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center mb-4">
                          Você ainda não fez nenhum pedido.
                        </p>
                      ) : (
                        <div className="space-y-2 mb-4">
                          {recentes.map(p => (
                            <Link key={p.id} href={`/pedidos/${p.id}`}>
                              <div className="flex items-center justify-between gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="min-w-0">
                                  <p className="text-sm font-medium">#{p.id} · {formatCurrency(p.total)}</p>
                                  <p className="text-xs text-muted-foreground">{formatDateTime(p.createdAt)}</p>
                                </div>
                                <StatusBadge status={p.status} className="text-xs shrink-0" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      <Button variant="outline" className="w-full" asChild>
                        <Link href={pedidos.length > 0 ? '/pedidos' : '/menu'}>
                          {pedidos.length > 0 ? 'Ver todos os pedidos' : 'Ver cardápio'}
                        </Link>
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Atalho do admin */}
              {isAdmin && (
                <Card>
                  <CardContent className="p-0">
                    <Link href="/admin">
                      <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <ShieldCheck className="h-5 w-5 text-primary" />
                        </div>
                        <span className="flex-1 font-medium">Painel administrativo</span>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Em breve */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    Próximas novidades
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {emBreve.map((item, index) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-4 p-4 opacity-70 ${index !== emBreve.length - 1 ? 'border-b border-border' : ''}`}
                    >
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.descricao}</p>
                      </div>
                      <Badge variant="secondary">Em breve</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sair */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 mb-8"
          >
            <Button variant="outline" className="w-full text-destructive hover:text-destructive gap-2" onClick={sair}>
              <LogOut className="h-4 w-4" />
              Sair da conta
            </Button>
          </motion.div>
        </div>
      </div>
    </ClientLayout>
  )
}
