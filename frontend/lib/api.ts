import { toast } from 'sonner'

// Único ponto do site que conversa com a API:
// - coloca o token (Authorization: Bearer) em todas as chamadas;
// - transforma os erros do ABP ({ error: { message } }) em ApiError;
// - se o token vencer (401), tenta renovar com o refresh_token; se não der, desloga.

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'

// Client cadastrado no OpenIddict do back (o mesmo que o app usa)
export const CLIENT_ID = 'Conexao4_App'
export const SCOPE = 'Conexao4 offline_access roles'

const TOKEN_KEY = 'c4_token'
const REFRESH_KEY = 'c4_refresh'

// ---------- Token (localStorage) ----------

export function getToken(): string | null {
  if (typeof window === 'undefined') return null // no servidor (SSR) não existe localStorage
  return localStorage.getItem(TOKEN_KEY)
}

export function saveTokens(accessToken: string | null, refreshToken?: string | null) {
  if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken)
  else localStorage.removeItem(TOKEN_KEY)

  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken)
  else if (refreshToken === null || !accessToken) localStorage.removeItem(REFRESH_KEY)
}

// Avisa o AuthProvider quando a sessão acaba (token vencido e sem renovação)
export const SESSAO_EXPIRADA = 'c4:sessao-expirada'

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

// ---------- Login e renovação (/connect/token) ----------

interface TokenResposta {
  access_token: string
  refresh_token?: string
}

async function pedirToken(campos: Record<string, string>): Promise<TokenResposta> {
  let res: Response
  try {
    res = await fetch(`${API_URL}/connect/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: CLIENT_ID, ...campos }),
    })
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor.', 0)
  }

  if (!res.ok) {
    // O /connect/token responde { error: "invalid_grant" } quando usuário ou senha estão errados
    const body = await res.json().catch(() => null)
    const mensagem = body?.error === 'invalid_grant'
      ? 'E-mail ou senha inválidos.'
      : 'Não foi possível entrar. Tente novamente.'
    throw new ApiError(mensagem, res.status)
  }

  return res.json()
}

export async function loginComSenha(usuario: string, senha: string) {
  const token = await pedirToken({ grant_type: 'password', username: usuario, password: senha, scope: SCOPE })
  saveTokens(token.access_token, token.refresh_token ?? null)
}

// Várias chamadas podem receber 401 ao mesmo tempo: todas esperam a mesma renovação
let renovando: Promise<boolean> | null = null

function renovarToken(): Promise<boolean> {
  if (!renovando) {
    renovando = (async () => {
      const refresh = typeof window !== 'undefined' ? localStorage.getItem(REFRESH_KEY) : null
      if (!refresh) return false
      try {
        const token = await pedirToken({ grant_type: 'refresh_token', refresh_token: refresh })
        saveTokens(token.access_token, token.refresh_token ?? refresh)
        return true
      } catch {
        return false
      }
    })().finally(() => { renovando = null })
  }
  return renovando
}

// ---------- Chamadas à API ----------

async function enviar(path: string, options: RequestInit): Promise<Response> {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')

  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  try {
    return await fetch(`${API_URL}${path}`, { ...options, headers })
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor.', 0)
  }
}

// O ABP devolve erros assim: { error: { message, validationErrors: [{ message }] } }
async function lerMensagemDeErro(res: Response): Promise<string> {
  const body = await res.json().catch(() => null)
  const erro = body?.error
  const validacoes: string[] = (erro?.validationErrors ?? [])
    .map((v: { message?: string }) => v.message)
    .filter(Boolean)

  if (validacoes.length > 0) return validacoes.join('\n')
  if (erro?.message) return erro.message
  if (res.status === 403) return 'Você não tem permissão para fazer isso.'
  if (res.status === 404) return 'Não encontrado.'
  return `Erro no servidor (${res.status}). Tente novamente.`
}

// Toda chamada à API passa por aqui
export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  let res = await enviar(path, options)

  if (res.status === 401 && getToken()) {
    if (await renovarToken()) res = await enviar(path, options)

    if (res.status === 401) {
      saveTokens(null)
      window.dispatchEvent(new Event(SESSAO_EXPIRADA))
      throw new ApiError('Sua sessão expirou. Entre novamente.', 401)
    }
  }

  if (!res.ok) throw new ApiError(await lerMensagemDeErro(res), res.status)

  const texto = await res.text()
  return (texto ? JSON.parse(texto) : undefined) as T
}

export function showError(err: unknown) {
  toast.error(err instanceof Error ? err.message : 'Algo deu errado. Tente novamente.')
}
