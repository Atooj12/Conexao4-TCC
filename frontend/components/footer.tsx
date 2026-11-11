'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Coffee, Instagram, Facebook, MapPin, Phone, Clock } from 'lucide-react'

export function Footer() {
  const pathname = usePathname()

  // Don't show footer on admin routes
  if (pathname.startsWith('/admin')) {
    return null
  }

  return (
    <footer className="border-t border-border bg-card">
      <div className="container px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Coffee className="h-8 w-8 text-primary" />
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold">Conexão 4</span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Café & Bistrô
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Café de especialidade e experiências gastronômicas únicas. 
              Cada xícara é preparada com paixão e dedicação.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-semibold">Navegação</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Início
              </Link>
              <Link href="/menu" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cardápio
              </Link>
              <Link href="/pedidos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Meus Pedidos
              </Link>
              <Link href="/perfil" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Minha Conta
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-semibold">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 shrink-0 text-primary" />
                <span>Rua das Flores, 123<br />Jardim Paulista - São Paulo, SP</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-5 w-5 shrink-0 text-primary" />
                <span>(11) 3456-7890</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-semibold">Horários</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Clock className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Segunda a Sexta</p>
                  <p>07:00 - 20:00</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Clock className="h-5 w-5 shrink-0 text-primary opacity-0" />
                <div>
                  <p className="font-medium text-foreground">Sábado e Domingo</p>
                  <p>08:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Conexão 4 Café & Bistrô. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
