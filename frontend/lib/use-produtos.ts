'use client'

import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { CATEGORIAS, toProduct, type ListaPaginada, type ProdutoDto } from '@/lib/adapters'
import type { Product } from '@/lib/types'

// Busca o cardápio na API (rota pública, não precisa de login).
// Usado na home, no /menu e no detalhe do produto.
export function useProdutos() {
  const [produtos, setProdutos] = useState<Product[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    setCarregando(true)
    setErro(null)
    try {
      const res = await apiFetch<ListaPaginada<ProdutoDto>>('/api/app/produto?MaxResultCount=100')
      const lista = res.items.map(toProduct)
      // Ordena por categoria (na ordem do cardápio) e depois por nome
      lista.sort((a, b) =>
        CATEGORIAS.indexOf(a.category) - CATEGORIAS.indexOf(b.category) ||
        a.name.localeCompare(b.name, 'pt-BR'))
      setProdutos(lista)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível carregar o cardápio.')
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  return { produtos, carregando, erro, recarregar: carregar }
}
