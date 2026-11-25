'use client'

import { useEffect, useRef } from 'react'

// Chama `fn` a cada `ms` enquanto `ativo` for true e a aba estiver visível.
// Usado para atualizar o status dos pedidos sem o usuário precisar dar F5.
export function useIntervalo(fn: () => void, ms: number, ativo: boolean) {
  const ultimaFn = useRef(fn)
  ultimaFn.current = fn

  useEffect(() => {
    if (!ativo) return
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') ultimaFn.current()
    }, ms)
    return () => clearInterval(id)
  }, [ms, ativo])
}
