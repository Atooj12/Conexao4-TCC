'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { apiFetch, showError } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import {
  FORMAS_PAGAMENTO,
  TIPOS_PEDIDO,
  toCartItem,
  type ItemPedidoDto,
  type PedidoDto,
  type TipoPedidoSite,
} from '@/lib/adapters'
import type { CartItem, PaymentMethod, Product } from '@/lib/types'

// O carrinho fica no back (tabela ItemPedido, sem pedido ainda).
// Assim ele sobrevive ao F5, à troca de navegador e é o mesmo do app.
// Aqui no site só guardamos uma cópia do que o back devolveu.

const BASE = '/api/app/item-pedido'

export interface DadosFinalizar {
  formaPagamento: PaymentMethod
  tipoPedido: TipoPedidoSite
  observacao: string
}

interface CartContextType {
  items: CartItem[]
  isOpen: boolean
  isLoading: boolean // carregando o carrinho do back
  isBusy: boolean // alguma alteração em andamento (trava os botões)
  addItem: (product: Product, quantity?: number) => Promise<boolean>
  removeItem: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  finalizarPedido: (dados: DadosFinalizar) => Promise<PedidoDto>
  toggleCart: () => void
  setCartOpen: (isOpen: boolean) => void
  itemCount: number
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: carregandoSessao } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isBusy, setIsBusy] = useState(false)
  const ocupado = useRef(false) // evita clique duplo enquanto uma chamada não termina

  const recarregar = useCallback(async () => {
    const res = await apiFetch<{ items: ItemPedidoDto[] }>(BASE)
    setItems(res.items.map(toCartItem))
  }, [])

  // Sempre que quem está logado muda (login, logout, F5), busca o carrinho dessa pessoa
  useEffect(() => {
    if (carregandoSessao) return
    if (!user) {
      setItems([])
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    recarregar()
      .catch(() => setItems([]))
      .finally(() => setIsLoading(false))
  }, [user?.id, carregandoSessao, recarregar]) // eslint-disable-line react-hooks/exhaustive-deps

  // Roda uma alteração no back e depois relê o carrinho (o back é quem calcula os valores)
  async function alterar(acao: () => Promise<unknown>) {
    if (ocupado.current) return
    ocupado.current = true
    setIsBusy(true)
    try {
      await acao()
      await recarregar()
    } catch (err) {
      showError(err)
      await recarregar().catch(() => {})
      throw err
    } finally {
      ocupado.current = false
      setIsBusy(false)
    }
  }

  const itemDoProduto = (productId: string) => items.find(i => i.product.id === productId)

  const addItem = async (product: Product, quantity = 1) => {
    if (carregandoSessao) return false // logo depois do F5, ainda descobrindo quem está logado
    if (!user) {
      toast.info('Entre na sua conta para montar o pedido.')
      router.push(`/auth?voltar=${encodeURIComponent(pathname)}`)
      return false
    }
    if (ocupado.current) return false
    try {
      await alterar(() => apiFetch(`${BASE}/adicionar-ao-carrinho/${product.id}?quantidade=${quantity}`, { method: 'POST' }))
      toast.success(`${product.name} adicionado ao carrinho`, {
        action: { label: 'Ver carrinho', onClick: () => setIsOpen(true) },
      })
      return true
    } catch {
      return false
    }
  }

  const removeItem = async (productId: string) => {
    const item = itemDoProduto(productId)
    if (!item?.id) return
    await alterar(() => apiFetch(`${BASE}/${item.id}`, { method: 'DELETE' })).catch(() => {})
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) return removeItem(productId)
    const item = itemDoProduto(productId)
    if (!item?.id) return
    await alterar(() =>
      apiFetch(`${BASE}/${item.id}/alterar-quantidade?quantidade=${quantity}`, { method: 'POST' })
    ).catch(() => {})
  }

  const clearCart = async () => {
    await alterar(() => apiFetch(`${BASE}/limpar-carrinho`, { method: 'POST' })).catch(() => {})
  }

  // Transforma o carrinho em pedido. O back confere os itens e calcula o total.
  const finalizarPedido = async ({ formaPagamento, tipoPedido, observacao }: DadosFinalizar) => {
    let pedido: PedidoDto | undefined
    await alterar(async () => {
      pedido = await apiFetch<PedidoDto>(`${BASE}/finalizar-carrinho`, {
        method: 'POST',
        body: JSON.stringify({
          formaPagamento: FORMAS_PAGAMENTO.indexOf(formaPagamento),
          tipoPedido: TIPOS_PEDIDO.indexOf(tipoPedido),
          observacao: observacao.trim() || null,
        }),
      })
    })
    if (!pedido) throw new Error('Não foi possível finalizar o pedido.')
    return pedido
  }

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const total = items.reduce((acc, item) => acc + (item.subtotal ?? item.product.price * item.quantity), 0)

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        isLoading,
        isBusy,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        finalizarPedido,
        toggleCart: () => setIsOpen(aberto => !aberto),
        setCartOpen: setIsOpen,
        itemCount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart precisa estar dentro do <CartProvider>')
  }
  return context
}
