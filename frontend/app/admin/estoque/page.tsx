'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Plus, 
  AlertTriangle, 
  Package, 
  TrendingDown,
  Edit2,
  MoreHorizontal
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { mockInventory, formatCurrency, formatDate } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = mockInventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const lowStockItems = mockInventory.filter(item => item.quantity <= item.minStock)
  const totalValue = mockInventory.reduce((acc, item) => acc + (item.quantity * item.costPerUnit), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Gestão de Estoque</h1>
          <p className="text-muted-foreground">
            Controle e monitore seu inventário
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Item
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Itens
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockInventory.length}</div>
              <p className="text-xs text-muted-foreground">produtos cadastrados</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Estoque Baixo
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</div>
              <p className="text-xs text-muted-foreground">itens precisam reposição</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Valor em Estoque
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
              <p className="text-xs text-muted-foreground">custo total</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                    Atenção: Itens com estoque baixo
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    {lowStockItems.map(item => item.name).join(', ')} estão abaixo do estoque mínimo.
                  </p>
                </div>
                <Button size="sm" variant="outline" className="shrink-0">
                  Repor Estoque
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Search and Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle>Itens do Estoque</CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar item..."
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
                    <TableHead>Item</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Estoque Mínimo</TableHead>
                    <TableHead>Custo Unit.</TableHead>
                    <TableHead>Última Reposição</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const stockPercentage = (item.quantity / (item.minStock * 3)) * 100
                    const isLowStock = item.quantity <= item.minStock
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            {item.supplier && (
                              <p className="text-xs text-muted-foreground">{item.supplier}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <span className="font-medium">
                              {item.quantity} {item.unit}
                            </span>
                            <Progress 
                              value={stockPercentage} 
                              className={cn(
                                'h-1.5',
                                isLowStock && '[&>div]:bg-yellow-500'
                              )}
                            />
                          </div>
                        </TableCell>
                        <TableCell>{item.minStock} {item.unit}</TableCell>
                        <TableCell>{formatCurrency(item.costPerUnit)}</TableCell>
                        <TableCell>{formatDate(item.lastRestocked)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={isLowStock ? 'destructive' : 'secondary'}
                            className={cn(
                              isLowStock && 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                            )}
                          >
                            {isLowStock ? 'Baixo' : 'Normal'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit2 className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar Estoque
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
