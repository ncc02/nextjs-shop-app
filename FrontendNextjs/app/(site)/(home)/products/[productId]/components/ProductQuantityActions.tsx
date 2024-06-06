'use client'

import { useState } from 'react'
import useCart from '@/app/hooks/useCart'
import { Product } from '@prisma/client'
import toast from 'react-hot-toast'
import axios from 'axios'

interface Props {
  product: Product
}
const ProductQuantityActions = ({ product }: Props) => {
  const [amount, setAmount] = useState(1)
  const { addToCart } = useCart()
  const handleAddToCart = () => {
    if (!product.isActive) return
    if (amount > 0) {
      addToCart({
        productId: product.id,
        quantity: amount,
        productPrice: product.price,
      })
      axios
        .post('/api/collect', {
          type: 'Cart',
          productId: product.id,
        })
        .catch(_err => {})
      toast.success('Added to cart', {
        position: 'top-right',
        className: 'mt-16',
      })
    } else {
      toast.error('Please select quantity', {
        position: 'top-right',
        className: 'mt-16',
      })
    }
  }

  return (
    <div className="flex flex-col lg:flex-row items-center lg:gap-12 gap-4">
      <div className="flex flex-row items-center">
        <button
          className="bg-gray-200 py-2 px-5 rounded-lg text-violet-800 lg:text-3xl"
          onClick={() => (amount == 0 ? '' : setAmount(prev => prev - 1))}
        >
          -
        </button>
        <span className="py-4 px-6 rounded-lg lg:text-xl lg:w-24 text-center">{amount}</span>
        <button
          className="bg-gray-200 py-2 px-4 rounded-lg text-violet-800 text-3xl"
          onClick={() =>
            amount >= product.quantity - product.sold ? '' : setAmount(prev => prev + 1)
          }
        >
          +
        </button>
      </div>
      <button
        className="bg-violet-800 text-white font-semibold py-3 px-8 lg:px-16 rounded-xl h-full"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </div>
  )
}

export default ProductQuantityActions
