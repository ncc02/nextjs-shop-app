import { create } from 'zustand'
import { CartItem } from '../types'
import axios from 'axios'

interface CartStore {
  cart: CartItem[]
  set: (cartItems: CartItem[]) => void
  addToCart: (cartItem: CartItem) => void
  updateCartItem: (productId: string, newQuantity: number) => void
  removeCartItem: (productId: string) => void
}

const useCart = create<CartStore>(set => {
  return {
    cart: [],
    set(cartItems) {
      set({ cart: cartItems })
      localStorage.setItem('cart', JSON.stringify(cartItems))
      cartItems.forEach(item =>
        axios
          .post('/api/cart', {
            productId: item.productId,
            quantity: item.quantity,
          })
          .catch(error => {
            console.log(error)
          }),
      )
    },
    addToCart: (cartItem: CartItem) => {
      set(state => {
        const existingItemIndex = state.cart.findIndex(
          item => item.productId === cartItem.productId,
        )

        if (existingItemIndex !== -1) {
          state.cart[existingItemIndex].quantity += cartItem.quantity
        } else {
          state.cart.push(cartItem)
        }
        localStorage.setItem('cart', JSON.stringify([...state.cart]))
        axios
          .post('/api/cart', {
            productId: cartItem.productId,
            quantity:
              existingItemIndex !== -1
                ? cartItem.quantity + state.cart[existingItemIndex].quantity
                : cartItem.quantity,
          })
          .catch(error => {
            console.log(error)
          })
        return { cart: [...state.cart] }
      })
    },
    updateCartItem: (productId: string, newQuantity: number) => {
      set(state => {
        const updatedCart = state.cart
          .map(item => (item.productId === productId ? { ...item, quantity: newQuantity } : item))
          .filter(item => item.quantity > 0)
        localStorage.setItem('cart', JSON.stringify(updatedCart))
        axios
          .post('/api/cart', {
            productId: productId,
            quantity: newQuantity,
          })
          .catch(error => {
            console.log(error)
          })
        return { cart: updatedCart }
      })
    },
    removeCartItem: (productId: string) => {
      set(state => {
        const updatedCart = state.cart.filter(item => item.productId !== productId)
        localStorage.setItem('cart', JSON.stringify(updatedCart))
        axios
          .post('/api/cart', {
            productId: productId,
            quantity: 0,
          })
          .catch(error => {
            console.log(error)
          })
        return { cart: updatedCart }
      })
    },
  }
})

export default useCart
