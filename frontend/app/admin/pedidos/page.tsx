'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  ChefHat,
  Truck,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockOrders, formatCurrency, formatDate } from '@/lib/mock-data'
import { orderStatusLabels, type OrderStatus, type Order } from '@/lib/types'
import { cn } from '@/lib/utils'

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  pending: <Clock className="h-4 w-4" />,
  confirmed: <CheckCircle2 className="h-4 w-4" />,
  preparing: <ChefHat className="h-4 w-4" />,
  ready: <CheckCircle2 className="h-4 w-4" />,
  delivered: <Truck className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />,
}

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
  preparing: 'bg-orange-100 text-orange-800 border-orange-300',
  ready: 'bg-green-100 text-green-800 border-green-300',
  delivered: 'bg-green-100 text-green-800 border-green-300',
  cancelled: 'bg-red-100 text-red-800 border-red-300',
}

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orders, setOrders] = useState(mockOrders)

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const orderCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  }

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Gestão de Pedidos</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe todos os pedidos
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
      </div>

      {/* Status Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-auto">
          <TabsTrigger value="all" className="gap-2">
            Todos
            <Badge variant="secondary" className="ml-1">{orderCounts.all}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-2">
            Pendentes
            <Badge variant="secondary" className="ml-1">{orderCounts.pending}</Badge>
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="gap-2">
            Confirmados
            <Badge variant="secondary" className="ml-1">{orderCounts.confirmed}</Badge>
          </TabsTrigger>
          <TabsTrigger value="preparing" className="gap-2">
            Preparando
            <Badge variant="secondary" className="ml-1">{orderCounts.preparing}</Badge>
          </TabsTrigger>
          <TabsTrigger value="ready" className="gap-2">
            Prontos
            <Badge variant="secondary" className="ml-1">{orderCounts.ready}</Badge>
          </TabsTrigger>
          <TabsTrigger value="delivered" className="gap-2">
            Entregues
            <Badge variant="secondary" className="ml-1">{orderCounts.delivered}</Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle>Lista de Pedidos</CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar pedido..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Itens</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Nenhum pedido encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <span className="font-mono text-sm">#{order.id.slice(-6).toUpperCase()}</span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{formatCurrency(order.total)}</span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={cn('gap-1', statusColors[order.status])}
                          >
                            {statusIcons[order.status]}
                            {orderStatusLabels[order.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {order.status === 'pending' && (
                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'confirmed')}>
                                  <CheckCircle2 className="mr-2 h-4 w-4 text-blue-600" />
                                  Confirmar Pedido
                                </DropdownMenuItem>
                              )}
                              {order.status === 'confirmed' && (
                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'preparing')}>
                                  <ChefHat className="mr-2 h-4 w-4 text-orange-600" />
                                  Iniciar Preparo
                                </DropdownMenuItem>
                              )}
                              {order.status === 'preparing' && (
                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'ready')}>
                                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                                  Marcar como Pronto
                                </DropdownMenuItem>
                              )}
                              {order.status === 'ready' && (
                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'delivered')}>
                                  <Truck className="mr-2 h-4 w-4 text-green-600" />
                                  Marcar como Entregue
                                </DropdownMenuItem>
                              )}
                              {order.status !== 'cancelled' && order.status !== 'delivered' && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                    className="text-destructive"
                                  >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancelar Pedido
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Pedido #{selectedOrder?.id.slice(-6).toUpperCase()}
              {selectedOrder && (
                <Badge 
                  variant="outline" 
                  className={cn('ml-2 gap-1', statusColors[selectedOrder.status])}
                >
                  {statusIcons[selectedOrder.status]}
                  {orderStatusLabels[selectedOrder.status]}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <p className="font-medium">
                    {selectedOrder.orderType === 'delivery' ? 'Entrega' : 
                     selectedOrder.orderType === 'pickup' ? 'Retirada' : 'Mesa'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                </div>
              </div>

              {/* Delivery Address */}
              {selectedOrder.orderType === 'delivery' && selectedOrder.deliveryAddress && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Endereço de Entrega</p>
                  <p className="font-medium">
                    {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.number}
                    {selectedOrder.deliveryAddress.complement && ` - ${selectedOrder.deliveryAddress.complement}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.deliveryAddress.neighborhood} - {selectedOrder.deliveryAddress.city}
                  </p>
                </div>
              )}

              {/* Order Items */}
              <div>
                <p className="text-sm text-muted-foreground mb-3">Itens do Pedido</p>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        {item.customizations && item.customizations.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {item.customizations.map(c => c.option).join(', ')}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-xs text-muted-foreground italic">Obs: {item.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.subtotal ?? (item.product.price * item.quantity))}</p>
                        <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-lg font-medium">Total</span>
                <span className="text-xl font-bold">{formatCurrency(selectedOrder.total)}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end">
                {selectedOrder.status === 'pending' && (
                  <Button onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed')}>
                    Confirmar Pedido
                  </Button>
                )}
                {selectedOrder.status === 'confirmed' && (
                  <Button onClick={() => updateOrderStatus(selectedOrder.id, 'preparing')}>
                    Iniciar Preparo
                  </Button>
                )}
                {selectedOrder.status === 'preparing' && (
                  <Button onClick={() => updateOrderStatus(selectedOrder.id, 'ready')}>
                    Marcar como Pronto
                  </Button>
                )}
                {selectedOrder.status === 'ready' && (
                  <Button onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}>
                    Marcar como Entregue
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
