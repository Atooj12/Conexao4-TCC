export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: Category
  tags: string[]
  available: boolean
  preparationTime: number // in minutes
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
  total: number
  subtotal: number
  tax: number
  createdAt: Date
  updatedAt: Date
  estimatedDelivery?: Date
  customerName: string
  customerPhone: string
  paymentMethod: PaymentMethod
  orderType: 'pickup' | 'delivery' | 'dine-in'
  deliveryAddress?: Address
  tableNumber?: number
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled'

export type PaymentMethod = 'pix' | 'credit' | 'debit' | 'cash'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  addresses: Address[]
  favoriteProducts: string[]
  orderHistory: string[]
  loyaltyPoints: number
  role: 'customer' | 'admin' | 'staff'
}

export interface Address {
  id: string
  label: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

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

export interface DashboardStats {
  todaySales: number
  todayOrders: number
  avgOrderValue: number
  pendingOrders: number
  popularProducts: { product: Product; count: number }[]
  revenueByHour: { hour: number; revenue: number }[]
  ordersByStatus: { status: OrderStatus; count: number }[]
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
