'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Coffee, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  Home,
  UtensilsCrossed,
  ClipboardList,
  Settings,
  LogIn
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/menu', label: 'Cardápio', icon: UtensilsCrossed },
  { href: '/pedidos', label: 'Meus Pedidos', icon: ClipboardList },
]

export function Navbar() {
  const pathname = usePathname()
  const { itemCount, toggleCart } = useCart()
  const { user, isAdmin } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Don't show navbar on admin routes
  if (pathname.startsWith('/admin')) {
    return null
  }

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 15 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Coffee className="h-8 w-8 text-primary" />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold leading-tight text-foreground">
              Conexão 4
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Café & Bistrô
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'gap-2 transition-all',
                    isActive && 'bg-secondary text-secondary-foreground'
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Cart Button */}
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={toggleCart}
          >
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2"
                >
                  <Badge 
                    className="h-5 w-5 rounded-full p-0 flex items-center justify-center bg-accent text-accent-foreground text-xs"
                  >
                    {itemCount}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
            <span className="sr-only">Carrinho de compras</span>
          </Button>

          {/* Conta: perfil se estiver logado, senão o botão Entrar */}
          {user ? (
            <Link href="/perfil" className="hidden md:block">
              <Button variant="outline" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Minha conta</span>
              </Button>
            </Link>
          ) : (
            <Link href="/auth" className="hidden md:block">
              <Button variant="outline" className="gap-2">
                <LogIn className="h-4 w-4" />
                Entrar
              </Button>
            </Link>
          )}

          {/* Painel do admin: só aparece para quem tem a permissão */}
          {isAdmin && (
            <Link href="/admin" className="hidden md:block">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Administração</span>
              </Button>
            </Link>
          )}

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-background" aria-describedby={undefined}>
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="flex flex-col gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <Coffee className="h-6 w-6 text-primary" />
                  <span className="font-serif text-lg font-bold">Conexão 4</span>
                </div>
                
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button
                          variant={isActive ? 'secondary' : 'ghost'}
                          className="w-full justify-start gap-3"
                        >
                          <link.icon className="h-5 w-5" />
                          {link.label}
                        </Button>
                      </Link>
                    )
                  })}
                </nav>

                <div className="border-t border-border pt-4">
                  <Link href={user ? '/perfil' : '/auth'} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-3">
                      {user ? <User className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
                      {user ? 'Minha Conta' : 'Entrar'}
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-3">
                        <Settings className="h-5 w-5" />
                        Administração
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
