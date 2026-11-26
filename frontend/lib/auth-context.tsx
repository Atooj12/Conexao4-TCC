'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ApiError, SESSAO_EXPIRADA, apiFetch, getToken, loginComSenha, saveTokens } from '@/lib/api'

// Permissão que identifica o administrador (a mesma que o app usa)
const PERMISSAO_ADMIN = 'Conexao4.Pedidos.Gerenciar'

export interface AuthUser {
  id: string
  userName: string
  name: string | null
  email: string | null
  phoneNumber: string | null
  isAdmin: boolean
}

// Parte do /api/abp/application-configuration que interessa aqui
interface AppConfig {
  currentUser: {
    isAuthenticated: boolean
    id: string | null
    userName: string | null
    name: string | null
    email: string | null
    phoneNumber: string | null
  }
  auth: { grantedPolicies: Record<string, boolean> }
}

// GET/PUT /api/account/my-profile
interface MeuPerfil {
  userName: string
  email: string
  name: string | null
  surname: string | null
  phoneNumber: string | null
  concurrencyStamp: string
}

export interface DadosCadastro {
  name: string
  email: string
  phone: string
  password: string
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAdmin: boolean
  login: (emailOuUsuario: string, password: string) => Promise<AuthUser | null>
  register: (dados: DadosCadastro) => Promise<AuthUser | null>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Descobre quem é o dono do token (e se é admin) perguntando pro ABP
  const loadUser = useCallback(async (): Promise<AuthUser | null> => {
    if (!getToken()) {
      setUser(null)
      return null
    }
    try {
      const config = await apiFetch<AppConfig>('/api/abp/application-configuration')
      const u = config.currentUser
      if (!u.isAuthenticated || !u.id) {
        saveTokens(null)
        setUser(null)
        return null
      }
      const atual: AuthUser = {
        id: u.id,
        userName: u.userName ?? '',
        name: u.name,
        email: u.email,
        phoneNumber: u.phoneNumber,
        isAdmin: config.auth.grantedPolicies[PERMISSAO_ADMIN] === true,
      }
      setUser(atual)
      return atual
    } catch (err) {
      // Back fora do ar (status 0): mantém o token, para a sessão voltar no próximo F5
      if (!(err instanceof ApiError && err.status === 0)) saveTokens(null)
      setUser(null)
      return null
    }
  }, [])

  // Ao abrir o site (ou dar F5), restaura a sessão a partir do token salvo
  useEffect(() => {
    loadUser().finally(() => setIsLoading(false))
  }, [loadUser])

  // O apiFetch avisa quando o token venceu e não deu pra renovar
  useEffect(() => {
    const aoExpirar = () => setUser(null)
    window.addEventListener(SESSAO_EXPIRADA, aoExpirar)
    return () => window.removeEventListener(SESSAO_EXPIRADA, aoExpirar)
  }, [])

  const login = async (emailOuUsuario: string, password: string) => {
    await loginComSenha(emailOuUsuario.trim(), password)
    return loadUser()
  }

  const register = async ({ name, email, phone, password }: DadosCadastro) => {
    // O register do ABP só recebe usuário, e-mail e senha
    await apiFetch('/api/account/register', {
      method: 'POST',
      body: JSON.stringify({ userName: email, emailAddress: email, password, appName: 'Conexao4' }),
    })

    // Cadastro não loga sozinho: entra em seguida
    await loginComSenha(email, password)

    // Nome e telefone vão para o perfil. Se falhar, a conta já existe e o login segue normal.
    try {
      const perfil = await apiFetch<MeuPerfil>('/api/account/my-profile')
      await apiFetch('/api/account/my-profile', {
        method: 'PUT',
        body: JSON.stringify({ ...perfil, name: name.trim() || null, phoneNumber: phone.trim() || null }),
      })
    } catch {
      // segue sem nome/telefone
    }

    return loadUser()
  }

  const logout = () => {
    saveTokens(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin: user?.isAdmin ?? false, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa estar dentro do <AuthProvider>')
  return ctx
}

// Nome para mostrar na tela: nome, senão usuário, senão e-mail
export function nomeExibicao(user: AuthUser | null) {
  return user?.name || user?.userName || user?.email || ''
}

// Para páginas que só fazem sentido logado: manda para o login e depois volta para `voltar`.
// `pronto` só fica true quando já se sabe que tem alguém logado.
export function useExigirLogin(voltar: string) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) router.replace(`/auth?voltar=${encodeURIComponent(voltar)}`)
  }, [isLoading, user, router, voltar])

  return { user, pronto: !isLoading && !!user }
}
