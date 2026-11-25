'use client'

import { CheckCircle2, ChefHat, Clock, Package, ShoppingBag, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { orderStatusLabels, type OrderStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

// Ícone e cores de cada status (usado na lista e no detalhe do pedido)
export const statusConfig: Record<OrderStatus, { icon: typeof Clock; color: string; bgColor: string; texto: string }> = {
  pending: { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100', texto: 'Aguardando o café confirmar seu pedido' },
  confirmed: { icon: CheckCircle2, color: 'text-blue-600', bgColor: 'bg-blue-100', texto: 'Pedido confirmado, logo entra em preparo' },
  preparing: { icon: ChefHat, color: 'text-orange-600', bgColor: 'bg-orange-100', texto: 'Seu pedido está sendo preparado' },
  ready: { icon: Package, color: 'text-green-600', bgColor: 'bg-green-100', texto: 'Pronto! Pode retirar no balcão' },
  delivered: { icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-100', texto: 'Pedido entregue. Bom apetite!' },
  cancelled: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100', texto: 'Pedido cancelado' },
}

export function StatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn(statusConfig[status].color, className)}>
      {orderStatusLabels[status]}
    </Badge>
  )
}

// Linha do tempo: Recebido → Confirmado → Em preparo → Pronto → Entregue
const etapas: { status: OrderStatus; label: string; icon: typeof Clock }[] = [
  { status: 'pending', label: 'Recebido', icon: ShoppingBag },
  { status: 'confirmed', label: 'Confirmado', icon: CheckCircle2 },
  { status: 'preparing', label: 'Em preparo', icon: ChefHat },
  { status: 'ready', label: 'Pronto', icon: Package },
  { status: 'delivered', label: 'Entregue', icon: CheckCircle2 },
]

export function OrderProgress({ status, size = 'sm' }: { status: OrderStatus; size?: 'sm' | 'lg' }) {
  const atual = etapas.findIndex(e => e.status === status)
  const grande = size === 'lg'

  return (
    <div className="flex items-start justify-between">
      {etapas.map((etapa, index) => {
        const feita = index <= atual
        const Icone = etapa.icon

        return (
          <div key={etapa.status} className="flex items-start flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'rounded-full flex items-center justify-center transition-colors',
                  grande ? 'h-10 w-10' : 'h-8 w-8',
                  feita ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}
              >
                <Icone className={grande ? 'h-5 w-5' : 'h-4 w-4'} />
              </div>
              <span
                className={cn(
                  'text-xs mt-1 text-center whitespace-nowrap',
                  index === atual ? 'font-medium' : 'text-muted-foreground'
                )}
              >
                {etapa.label}
              </span>
            </div>
            {index < etapas.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-1 sm:mx-2',
                  grande ? 'mt-5' : 'mt-4',
                  index < atual ? 'bg-primary' : 'bg-muted'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
