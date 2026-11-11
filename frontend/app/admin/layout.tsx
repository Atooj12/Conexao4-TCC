'use client'

import { useState, ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Coffee, 
  LayoutDashboard, 
  ClipboardList, 
  Package, 
  BarChart3, 
  Settings,
  Menu,
  X,
  Bell,
  LogOut,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: ClipboardList, label: 'Pedidos', href: '/admin/pedidos', badge: '5' },
  { icon: Package, label: 'Estoque', href: '/admin/estoque' },
  { icon: BarChart3, label: 'Relatórios', href: '/admin/relatorios' },
  { icon: Settings, label: 'Configurações', href: '/admin/configuracoes' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href))
              
              return (
                <Link key={item.href} href={item.href}>
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
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          'h-5 min-w-5 px-1.5',
                          isActive 
                            ? 'bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground' 
                            : 'bg-sidebar-primary text-sidebar-primary-foreground'
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* User */}
          <div className="border-t border-sidebar-border p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent transition-colors">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-sidebar-foreground">Admin</p>
                    <p className="text-xs text-sidebar-foreground/60">admin@conexao4.com</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-sidebar-foreground/60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
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
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-sidebar">
              <div className="flex h-full flex-col">
                <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
                  <Coffee className="h-7 w-7 text-sidebar-primary" />
                  <span className="font-serif text-lg font-bold text-sidebar-foreground">Conexão 4</span>
                </div>
                <nav className="flex-1 space-y-1 p-4">
                  {sidebarItems.map((item) => {
                    const isActive = pathname === item.href || 
                      (item.href !== '/admin' && pathname.startsWith(item.href))
                    
                    return (
                      <Link 
                        key={item.href} 
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                            isActive
                              ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                              : 'text-sidebar-foreground hover:bg-sidebar-accent'
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="h-5 min-w-5 px-1.5">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1">
            <h1 className="text-lg font-semibold lg:hidden">Admin</h1>
          </div>

          {/* Notifications */}
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
              3
            </span>
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
