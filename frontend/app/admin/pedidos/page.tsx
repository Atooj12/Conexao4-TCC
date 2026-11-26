'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Search,
  Eye,
  XCircle,
  MoreHorizontal,
  RefreshCw,
  ArrowRight,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/pedido-status'
import { showError } from '@/lib/api'
import { STATUS_PEDIDO, pedidoEncerrado } from '@/lib/adapters'
import {
  alterarStatusPedido,
  buscarTodosPedidos,
  contarPedidosPorStatus,
  proximoStatus,
} from '@/lib/pedidos'
import { useIntervalo } from '@/lib/use-intervalo'
import { formatCurrency, formatDateTime } from '@/lib/format'
import { orderStatusLabels, paymentMethodLabels, type Order, type OrderStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

type Filtro = OrderStatus | 'all'

const POR_PAGINA = 50

const abas: { value: Filtro; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'confirmed', label: 'Confirmados' },
  { value: 'preparing', label: 'Em preparo' },
  { value: 'ready', label: 'Prontos' },
  { value: 'delivered', label: 'Entregues' },
  { value: 'cancelled', label: 'Cancelados' },
]

const tipoPedidoTexto: Record<Order['orderType'], string> = {
  'pickup': 'Retirada',
  'dine-in': 'No café',
  'delivery': 'Entrega',
}

function filtroDaUrl(valor: string | null): Filtro {
  return valor && (STATUS_PEDIDO as string[]).includes(valor) ? (valor as OrderStatus) : 'all'
}

function AdminOrdersPageConteudo() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<Filtro>(filtroDaUrl(searchParams.get('status')))
  const [searchQuery, setSearchQuery] = useState('')

  const [orders, setOrders] = useState<Order[]>([])
  const [totalNoFiltro, setTotalNoFiltro] = useState(0)
  const [contagem, setContagem] = useState<Record<Filtro, number> | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [carregandoMais, setCarregandoMais] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [paraCancelar, setParaCancelar] = useState<Order | null>(null)
  const [alterando, setAlterando] = useState<string | null>(null) // id do pedido sendo alterado

  // O sino do menu leva para ?status=pending: segue a URL quando ela muda
  useEffect(() => {
    setStatusFilter(filtroDaUrl(searchParams.get('status')))
  }, [searchParams])

  // Recarrega a lista (mantendo quantos já estavam carregados) e as contagens das abas
  const carregar = useCallback(async (silencioso = false, quantos = POR_PAGINA) => {
    if (!silencioso) setCarregando(true)
    try {
      const filtro = statusFilter === 'all' ? null : statusFilter
      const [pagina, contagens] = await Promise.all([
        buscarTodosPedidos(filtro, 0, quantos),
        contarPedidosPorStatus(),
      ])
      setOrders(pagina.pedidos)
      setTotalNoFiltro(pagina.total)
      setContagem(contagens)
      setErro(null)
    } catch (err) {
      if (!silencioso) setErro(err instanceof Error ? err.message : 'Não foi possível carregar os pedidos.')
    } finally {
      setCarregando(false)
    }
  }, [statusFilter])

  useEffect(() => {
    carregar()
  }, [carregar])

  // Pedidos novos chegam a qualquer momento: confere a cada 20 s
  useIntervalo(() => carregar(true, Math.max(POR_PAGINA, orders.length)), 20000, !carregando)

  const carregarMais = async () => {
    setCarregandoMais(true)
    try {
      const filtro = statusFilter === 'all' ? null : statusFilter
      const pagina = await buscarTodosPedidos(filtro, orders.length, POR_PAGINA)
      // evita repetir se chegou pedido novo entre uma página e outra
      setOrders(atual => [...atual, ...pagina.pedidos.filter(p => !atual.some(a => a.id === p.id))])
      setTotalNoFiltro(pagina.total)
    } catch (err) {
      showError(err)
    } finally {
      setCarregandoMais(false)
    }
  }

  const mudarStatus = async (order: Order, novo: OrderStatus) => {
    setAlterando(order.id)
    try {
      const atualizado = await alterarStatusPedido(order.id, novo)
      toast.success(`Pedido #${order.id}: ${orderStatusLabels[atualizado.status]}`)
      setSelectedOrder(atual => (atual?.id === order.id ? atualizado : atual))
      await carregar(true, Math.max(POR_PAGINA, orders.length))
    } catch (err) {
      showError(err)
      await carregar(true, Math.max(POR_PAGINA, orders.length))
    } finally {
      setAlterando(null)
    }
  }

  const termo = searchQuery.trim().toLowerCase().replace(/^#/, '')
  const filteredOrders = termo
    ? orders.filter(o => o.id.includes(termo) || o.customerName.toLowerCase().includes(termo))
    : orders

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Gestão de Pedidos</h1>
          <p className="text-muted-foreground">
            Avance o status conforme o pedido anda. A lista atualiza sozinha.
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => carregar()} disabled={carregando}>
          <RefreshCw className={cn('h-4 w-4', carregando && 'animate-spin')} />
          Atualizar
        </Button>
      </div>

      {/* Abas de status */}
      {/* A aba vai para a URL: assim o sino (?status=pending) funciona mesmo estando em outra aba */}
      <Tabs value={statusFilter} onValueChange={(v) => router.replace(v === 'all' ? '/admin/pedidos' : `/admin/pedidos?status=${v}`)}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 h-auto">
          {abas.map(aba => (
            <TabsTrigger key={aba.value} value={aba.value} className="gap-2">
              {aba.label}
              {contagem && (
                <Badge variant="secondary" className="ml-1">{contagem[aba.value]}</Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Lista */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle>
                Lista de Pedidos
                {!carregando && !erro && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    {orders.length} de {totalNoFiltro}
                  </span>
                )}
              </CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nº ou cliente..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {erro ? (
              <div className="text-center py-12">
                <p className="font-medium mb-1">Não foi possível carregar os pedidos</p>
                <p className="text-sm text-muted-foreground mb-4">{erro}</p>
                <Button variant="outline" onClick={() => carregar()}>Tentar de novo</Button>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Itens</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {carregando ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={7}><div className="h-6 bg-muted rounded animate-pulse" /></TableCell>
                        </TableRow>
                      ))
                    ) : filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          {termo ? 'Nenhum pedido encontrado com essa busca' : 'Nenhum pedido aqui'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => {
                        const proximo = proximoStatus[order.status]
                        const ocupado = alterando === order.id
                        return (
                          <TableRow key={order.id}>
                            <TableCell>
                              <span className="font-mono text-sm">#{order.id}</span>
                            </TableCell>
                            <TableCell>
                              <p className="font-medium">{order.customerName || '-'}</p>
                              <p className="text-xs text-muted-foreground">{tipoPedidoTexto[order.orderType]}</p>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm" title={order.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}>
                                {order.items.reduce((s, i) => s + i.quantity, 0)} {order.items.reduce((s, i) => s + i.quantity, 0) === 1 ? 'item' : 'itens'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">{formatCurrency(order.total)}</span>
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={order.status} />
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground whitespace-nowrap">
                                {formatDateTime(order.createdAt)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-1">
                                {proximo && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-1 whitespace-nowrap"
                                    disabled={ocupado}
                                    onClick={() => mudarStatus(order, proximo.status)}
                                  >
                                    {proximo.acao}
                                    <ArrowRight className="h-3 w-3" />
                                  </Button>
                                )}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled={ocupado}>
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Mais ações</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      Ver detalhes
                                    </DropdownMenuItem>
                                    {!pedidoEncerrado(order.status) && (
                                      <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          onClick={() => setParaCancelar(order)}
                                          className="text-destructive"
                                        >
                                          <XCircle className="mr-2 h-4 w-4" />
                                          Cancelar pedido
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {!carregando && !erro && orders.length < totalNoFiltro && (
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={carregarMais} disabled={carregandoMais}>
                  {carregandoMais ? 'Carregando...' : 'Carregar mais'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Detalhes do pedido */}
      <Dialog open={!!selectedOrder} onOpenChange={(aberto) => !aberto && setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Pedido #{selectedOrder?.id}
              {selectedOrder && <StatusBadge status={selectedOrder.status} className="ml-2" />}
            </DialogTitle>
            <DialogDescription>
              {selectedOrder && formatDateTime(selectedOrder.createdAt)}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-medium">{selectedOrder.customerName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <p className="font-medium">{tipoPedidoTexto[selectedOrder.orderType]}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pagamento</p>
                  <p className="font-medium">{paymentMethodLabels[selectedOrder.paymentMethod]}</p>
                </div>
                {selectedOrder.notes && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Observação</p>
                    <p className="font-medium whitespace-pre-line">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-3">Itens do pedido</p>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id ?? item.product.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{item.quantity}x {item.product.name}</p>
                        <p className="text-xs text-muted-foreground">{formatCurrency(item.product.price)} cada</p>
                      </div>
                      <p className="font-medium">{formatCurrency(item.subtotal ?? item.product.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-lg font-medium">Total</span>
                <span className="text-xl font-bold">{formatCurrency(selectedOrder.total)}</span>
              </div>

              {!pedidoEncerrado(selectedOrder.status) && (
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    disabled={alterando === selectedOrder.id}
                    onClick={() => setParaCancelar(selectedOrder)}
                  >
                    Cancelar pedido
                  </Button>
                  {proximoStatus[selectedOrder.status] && (
                    <Button
                      disabled={alterando === selectedOrder.id}
                      onClick={() => mudarStatus(selectedOrder, proximoStatus[selectedOrder.status]!.status)}
                    >
                      {proximoStatus[selectedOrder.status]!.acao}
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmação de cancelamento */}
      <AlertDialog open={!!paraCancelar} onOpenChange={(aberto) => !aberto && setParaCancelar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar o pedido #{paraCancelar?.id}?</AlertDialogTitle>
            <AlertDialogDescription>
              O cliente vai ver o pedido como cancelado. Pedido cancelado não volta a andar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (paraCancelar) mudarStatus(paraCancelar, 'cancelled')
                setParaCancelar(null)
              }}
            >
              Cancelar pedido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// useSearchParams precisa de um Suspense em volta para o "next build" gerar a página
export default function AdminOrdersPage() {
  return (
    <Suspense>
      <AdminOrdersPageConteudo />
    </Suspense>
  )
}
