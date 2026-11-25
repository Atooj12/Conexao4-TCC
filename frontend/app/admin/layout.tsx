'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Coffee,
  LayoutDashboard,
  ClipboardList,
  Package,
  BarChart3,
  Settings,
  Menu,
  Bell,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useAuth, nomeExibicao } from '@/lib/auth-context'
import { PEDIDOS_MUDARAM, contarPedidosPendentes } from '@/lib/pedidos'
import { useIntervalo } from '@/lib/use-intervalo'
import { cn } from '@/lib/utils'

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: ClipboardList, label: 'Pedidos', href: '/admin/pedidos', mostraPendentes: true },
  { icon: Package, label: 'Estoque', href: '/admin/estoque' },
  { icon: BarChart3, label: 'Relatórios', href: '/admin/relatorios' },
  { icon: Settings, label: 'Configurações', href: '/admin/configuracoes' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAdmin, isLoading, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [pendentes, setPendentes] = useState(0)

  // Só admin entra aqui. Sem login: vai pro login e volta. Cliente logado: volta pra home.
  useEffect(() => {
    if (isLoading) return
    if (!user) router.replace(`/auth?voltar=${encodeURIComponent(pathname)}`)
    else if (!isAdmin) {
      toast.error('Essa área é só para administradores.')
      router.replace('/')
    }
  }, [isLoading, user, isAdmin, pathname, router])

  const liberado = !isLoading && !!user && isAdmin

  // Contador de pedidos pendentes no menu e no sino
  const atualizarPendentes = useCallback(() => {
    contarPedidosPendentes().then(setPendentes).catch(() => {})
  }, [])

  useEffect(() => {
    if (!liberado) return
    atualizarPendentes()
    window.addEventListener(PEDIDOS_MUDARAM, atualizarPendentes)
    return () => window.removeEventListener(PEDIDOS_MUDARAM, atualizarPendentes)
  }, [liberado, atualizarPendentes])

  useIntervalo(atualizarPendentes, 30000, liberado)

  if (!liberado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  const nome = nomeExibicao(user)
  const iniciais = nome.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join('')

  const sair = () => {
    logout()
    router.push('/')
  }

  const menu = (aoClicar?: () => void) => (
    <nav className="flex-1 space-y-1 p-4">
      {sidebarItems.map((item) => {
        const isActive = pathname === item.href ||
          (item.href !== '/admin' && pathname.startsWith(item.href))
        const contador = item.mostraPendentes && pendentes > 0 ? pendentes : null

        return (
          <Link key={item.href} href={item.href} onClick={aoClicar}>
            <div
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="flex-1">{item.label}</span>
              {contador !== null && (
                <Badge
                  variant="secondary"
                  title="Pedidos pendentes"
                  className={cn(
                    'h-5 min-w-5 px-1.5',
                    isActive
                      ? 'bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground'
                      : 'bg-sidebar-primary text-sidebar-primary-foreground'
                  )}
                >
                  {contador}
                </Badge>
              )}
            </div>
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-sidebar-border bg-sidebar lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
            <Coffee className="h-7 w-7 text-sidebar-primary" />
            <div>
              <span className="font-serif text-lg font-bold text-sidebar-foreground">Conexão 4</span>
              <p className="text-[10px] text-sidebar-foreground/60 uppercase tracking-wider">Admin</p>
            </div>
          </div>

          {menu()}

          {/* Usuário logado */}
          <div className="border-t border-sidebar-border p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent transition-colors">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                      {iniciais}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">{nome}</p>
                    <p className="text-xs text-sidebar-foreground/60 truncate">{user.email}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-sidebar-foreground/60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="text-destructive" onClick={sair}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background px-4 lg:px-6">
          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-sidebar" aria-describedby={undefined}>
              <SheetTitle className="sr-only">Menu do admin</SheetTitle>
              <div className="flex h-full flex-col">
                <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
                  <Coffee className="h-7 w-7 text-sidebar-primary" />
                  <span className="font-serif text-lg font-bold text-sidebar-foreground">Conexão 4</span>
                </div>
                {menu(() => setIsMobileMenuOpen(false))}
                <div className="border-t border-sidebar-border p-4">
                  <Button variant="ghost" className="w-full justify-start gap-2 text-destructive" onClick={sair}>
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1">
            <h1 className="text-lg font-semibold lg:hidden">Admin</h1>
          </div>

          {/* Sino: leva para os pedidos pendentes */}
          <Button variant="outline" size="icon" className="relative" asChild>
            <Link href="/admin/pedidos?status=pending" title="Pedidos pendentes">
              <Bell className="h-5 w-5" />
              {pendentes > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
                  {pendentes}
                </span>
              )}
              <span className="sr-only">Pedidos pendentes</span>
            </Link>
          </Button>

          {/* Back to site */}
          <Button variant="outline" asChild>
            <Link href="/">Voltar ao site</Link>
          </Button>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
