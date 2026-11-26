export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: Category
  tags: string[]
  available: boolean
  preparationTime?: number // em minutos (o back ainda não tem esse campo)
  ingredients?: string[]
  nutritionalInfo?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

export type Category = 
  | 'cafes'
  | 'bebidas-geladas'
  | 'lanches'
  | 'doces'
  | 'salgados'
  | 'especiais'

export interface CartItem {
  id?: string // id do item do carrinho no back
  product: Product
  quantity: number
  notes?: string
  customizations?: { name: string; option: string; price: number }[]
  subtotal?: number
}

export interface Order {
  id: string
  items: CartItem[]
  status: OrderStatus
  total: number // calculado no back
  createdAt: Date
  customerName: string
  paymentMethod: PaymentMethod
  orderType: 'pickup' | 'delivery' | 'dine-in'
  notes?: string // observação do pedido
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled'

export type PaymentMethod = 'pix' | 'credit' | 'debit' | 'cash'

// Só a tela de Estoque (demonstração) usa
export interface InventoryItem {
  id: string
  name: string
  quantity: number
  unit: string
  minStock: number
  lastRestocked: Date
  supplier?: string
  costPerUnit: number
}

export const categoryLabels: Record<Category, string> = {
  'cafes': 'Cafés',
  'bebidas-geladas': 'Bebidas Geladas',
  'lanches': 'Lanches',
  'doces': 'Doces',
  'salgados': 'Salgados',
  'especiais': 'Especiais',
}

export const orderStatusLabels: Record<OrderStatus, string> = {
  'pending': 'Pendente',
  'confirmed': 'Confirmado',
  'preparing': 'Preparando',
  'ready': 'Pronto',
  'delivered': 'Entregue',
  'cancelled': 'Cancelado',
}

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  'pix': 'PIX',
  'credit': 'Cartão de Crédito',
  'debit': 'Cartão de Débito',
  'cash': 'Dinheiro',
}
