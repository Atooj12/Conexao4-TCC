'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Coffee, Mail, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsSuccess(true)
  }

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
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-start mb-6">
                      <Link
                        href="/auth"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Voltar para o Login
                      </Link>
                    </div>

                    <div className="mb-6">
                      <h2 className="font-serif text-2xl font-semibold text-foreground">
                        Esqueceu sua senha?
                      </h2>
                      <p className="text-sm text-muted-foreground mt-2">
                        Digite seu e-mail cadastrado e enviaremos um link para redefinir sua senha.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          E-mail
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            className="pl-11 h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-card transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 text-base font-medium rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        ) : (
                          <>
                            Enviar Link
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-center py-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>

                    <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
                      E-mail enviado!
                    </h2>
                    <p className="text-muted-foreground mb-8 text-sm leading-relaxed max-w-xs mx-auto">
                      Enviamos um link de recuperação para <strong>{email}</strong>. Por favor, verifique sua caixa de entrada e pasta de spam.
                    </p>

                    <Button asChild className="w-full h-12 rounded-xl">
                      <Link href="/auth">
                        Ir para o Login
                      </Link>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
