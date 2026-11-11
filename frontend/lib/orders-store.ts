import type { Order } from './types'
import { mockOrders } from './mock-data'

const ORDERS_KEY = 'conexao4_orders'

// Helper to convert date strings back to Date objects in parsed orders
function parseOrderDates(order: any): Order {
  return {
    ...order,
    createdAt: new Date(order.createdAt),
    updatedAt: new Date(order.updatedAt),
    estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery) : undefined,
  }
}

export function getOrders(): Order[] {
  if (typeof window === 'undefined') {
    return mockOrders
  }

  const stored = localStorage.getItem(ORDERS_KEY)
  if (!stored) {
    // Seed with initial mock orders
    localStorage.setItem(ORDERS_KEY, JSON.stringify(mockOrders))
    return mockOrders
  }

  try {
    const parsed = JSON.parse(stored)
    return parsed.map(parseOrderDates)
  } catch (error) {
    console.error('Failed to parse orders from localStorage', error)
    return mockOrders
  }
}

export function getOrderById(id: string): Order | undefined {
  const orders = getOrders()
  return orders.find(o => o.id === id)
}

export function addOrder(order: Order): void {
  if (typeof window === 'undefined') return

  const orders = getOrders()
  // Add the new order at the beginning of the list
  const updatedOrders = [order, ...orders]
  localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders))
}
