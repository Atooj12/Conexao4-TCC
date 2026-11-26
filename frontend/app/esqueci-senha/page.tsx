'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Coffee shop image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80')`,
            filter: 'blur(2px)',
            transform: 'scale(1.05)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-transparent" />
        
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-lg"
          >
            <div className="relative mb-8 flex justify-center">
              <div className="w-80 h-48 flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Logo Conexão 4"
                  width={250}
                  height={250}
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <h1 className="font-serif text-5xl font-bold mb-3 tracking-tight">
              Conexão 4
            </h1>
            <p className="text-xl font-light tracking-[0.3em] uppercase mb-8 text-white/80">
              Café & Bistrô
            </p>
            
            <p className="text-lg text-white/70 leading-relaxed">
              Não se preocupe, vamos ajudar você a recuperar o seu acesso para que possa saborear nossos melhores cafés em instantes.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-24 h-24 mx-auto rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Logo Conexão 4"
                  width={90}
                  height={90}
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          <Card className="border-border/50 shadow-2xl shadow-primary/5 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex justify-start mb-6">
                <Link
                  href="/auth"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar para o Login
                </Link>
              </div>

              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Mail className="h-8 w-8 text-primary" />
              </div>

              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                Esqueceu sua senha?
              </h2>
              {/* O envio de e-mail ainda não está configurado no back; por enquanto quem troca a senha é a equipe */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                A recuperação por e-mail ainda não está disponível. Fale com a equipe do café no balcão:
                eles conseguem redefinir a sua senha pelo painel administrativo.
              </p>
              <p className="text-xs text-muted-foreground mb-8">
                Em breve você vai poder fazer isso sozinho por aqui.
              </p>

              <Button asChild className="w-full h-12 rounded-xl">
                <Link href="/auth">
                  Ir para o Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
