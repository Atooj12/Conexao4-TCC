'use client'
import Image from "next/image"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Coffee, Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tabParam === 'register' ? 'register' : 'login')
  
  useEffect(() => {
    if (tabParam === 'register') {
      setActiveTab('register')
    }
  }, [tabParam])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Login state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    remember: false,
  })

  // Register state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  })

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    router.push('/')
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    router.push('/')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Coffee shop image with blur */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background image with blur */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80')`,
            filter: 'blur(2px)',
            transform: 'scale(1.05)',
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center max-w-lg"
          >
            {/* Coffee cup illustration */}
            <div className="relative mb-8">
              <div className="relative mb-6 flex justify-center">
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
              {/* Steam animation */}
              <motion.div
                className="absolute -top-4 left-1/2 -translate-x-1/2"
                animate={{ y: [-5, -15, -5], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg width="80" height="80" viewBox="0 0 40 40" className="text-white/40">
                  <path
                    d="M10 30 Q15 20 10 10 M20 30 Q25 20 20 10 M30 30 Q35 20 30 10"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>
            </div>

            <h1 className="font-serif text-5xl font-bold mb-3 tracking-tight">
              Conexao 4
            </h1>
            <p className="text-xl font-light tracking-[0.3em] uppercase mb-8 text-white/80">
              Cafe & Bistro
            </p>
            
            <p className="text-lg text-white/70 leading-relaxed mb-10">
              Experimente o melhor cafe artesanal da cidade. 
              Cada xicara e preparada com carinho e dedicacao.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <div className="h-2 w-2 rounded-full bg-accent" />
                <span className="text-white/90">Cafe de especialidade</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <div className="h-2 w-2 rounded-full bg-accent" />
                <span className="text-white/90">Pedidos online</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <div className="h-2 w-2 rounded-full bg-accent" />
                <span className="text-white/90">Programa fidelidade</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <div className="h-2 w-2 rounded-full bg-accent" />
                <span className="text-white/90">Delivery rapido</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      </div>

      {/* Right side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-32 h-32 mx-auto rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Logo Conexão 4"
                  width={110}
                  height={110}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="text-left">
                <span className="font-serif text-2xl font-bold block text-foreground">
                  Conexão 4
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Café & Bistrô
                </span>
              </div>
            </Link>
          </div>

          <Card className="border-border/50 shadow-2xl shadow-primary/5 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-2 h-14 p-1.5 bg-muted/50 rounded-none border-b">
                <TabsTrigger 
                  value="login" 
                  className="text-base font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-lg transition-all"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="text-base font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-lg transition-all"
                >
                  Criar conta
                </TabsTrigger>
              </TabsList>

              <CardContent className="p-6 pt-8">
                <AnimatePresence mode="wait">
                  {/* Login Form */}
                  <TabsContent value="login" className="mt-0">
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-center mb-6">
                        <h2 className="font-serif text-2xl font-semibold text-foreground">Bem-vindo de volta</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          Entre com sua conta para continuar
                        </p>
                      </div>

                      <form onSubmit={handleLoginSubmit} className="space-y-5">
                        <div className="space-y-2">
                          <Label htmlFor="login-email" className="text-sm font-medium">E-mail</Label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="login-email"
                              type="email"
                              placeholder="seu@email.com"
                              className="pl-11 h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-card transition-colors"
                              value={loginData.email}
                              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="login-password" className="text-sm font-medium">Senha</Label>
                            <Link 
                              href="/esqueci-senha" 
                              className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors"
                            >
                              Esqueceu a senha?
                            </Link>
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="login-password"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Sua senha"
                              className="pl-11 pr-11 h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-card transition-colors"
                              value={loginData.password}
                              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="remember" 
                            checked={loginData.remember}
                            onCheckedChange={(checked) => setLoginData({ ...loginData, remember: checked as boolean })}
                            className="rounded"
                          />
                          <label
                            htmlFor="remember"
                            className="text-sm text-muted-foreground cursor-pointer select-none"
                          >
                            Lembrar de mim
                          </label>
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
                              Entrar
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </form>
                    </motion.div>
                  </TabsContent>

                  {/* Register Form */}
                  <TabsContent value="register" className="mt-0">
                    <motion.div
                      key="register"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-center mb-6">
                        <h2 className="font-serif text-2xl font-semibold text-foreground">Criar conta</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          Preencha seus dados para comecar
                        </p>
                      </div>

                      <form onSubmit={handleRegisterSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="register-name" className="text-sm font-medium">Nome completo</Label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="register-name"
                              type="text"
                              placeholder="Seu nome completo"
                              className="pl-11 h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-card transition-colors"
                              value={registerData.name}
                              onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="register-email" className="text-sm font-medium">E-mail</Label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="register-email"
                              type="email"
                              placeholder="seu@email.com"
                              className="pl-11 h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-card transition-colors"
                              value={registerData.email}
                              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="register-phone" className="text-sm font-medium">Telefone</Label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="register-phone"
                              type="tel"
                              placeholder="(11) 99999-9999"
                              className="pl-11 h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-card transition-colors"
                              value={registerData.phone}
                              onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="register-password" className="text-sm font-medium">Senha</Label>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="register-password"
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="Crie uma senha forte"
                              className="pl-11 pr-11 h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-card transition-colors"
                              value={registerData.password}
                              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground">Minimo de 8 caracteres</p>
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
                              Cadastrar
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </form>
                    </motion.div>
                  </TabsContent>
                </AnimatePresence>
              </CardContent>
            </Tabs>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Ao continuar, voce concorda com nossos{' '}
            <Link href="/termos" className="text-primary hover:underline">
              Termos de Uso
            </Link>{' '}
            e{' '}
            <Link href="/privacidade" className="text-primary hover:underline">
              Politica de Privacidade
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
