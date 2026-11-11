'use client'

import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { CartItem, Product } from './types'

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; quantity?: number; notes?: string }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'UPDATE_NOTES'; productId: string; notes: string }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; isOpen: boolean }

interface CartContextType extends CartState {
  addItem: (product: Product, quantity?: number, notes?: string) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  updateNotes: (productId: string, notes: string) => void
  clearCart: () => void
  toggleCart: () => void
  setCartOpen: (isOpen: boolean) => void
  itemCount: number
  subtotal: number
  tax: number
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === action.product.id
      )

      if (existingIndex > -1) {
        const newItems = [...state.items]
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + (action.quantity || 1),
        }
        return { ...state, items: newItems }
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            product: action.product,
            quantity: action.quantity || 1,
            notes: action.notes,
          },
        ],
      }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== action.productId),
      }

    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.product.id !== action.productId),
        }
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.productId
            ? { ...item, quantity: action.quantity }
            : item
        ),
      }
    }

    case 'UPDATE_NOTES':
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.productId
            ? { ...item, notes: action.notes }
            : item
        ),
      }

    case 'CLEAR_CART':
      return { ...state, items: [] }

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }

    case 'SET_CART_OPEN':
      return { ...state, isOpen: action.isOpen }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  })

  const addItem = (product: Product, quantity?: number, notes?: string) => {
    dispatch({ type: 'ADD_ITEM', product, quantity, notes })
  }

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', productId })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity })
  }

  const updateNotes = (productId: string, notes: string) => {
    dispatch({ type: 'UPDATE_NOTES', productId, notes })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  const setCartOpen = (isOpen: boolean) => {
    dispatch({ type: 'SET_CART_OPEN', isOpen })
  }

  const itemCount = state.items.reduce((acc, item) => acc + item.quantity, 0)
  const subtotal = state.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  )
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        updateNotes,
        clearCart,
        toggleCart,
        setCartOpen,
        itemCount,
        subtotal,
        tax,
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
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
