'use client'

import useCart from '@/app/hooks/useCart'
import CartIem from './CartIem'
import Image from 'next/image'
import Checkout from './Checkout'
import { CartItem, PublicUserType } from '@/app/types'
import { useEffect, useState } from 'react'

interface CartProps {
  cartData?: CartItem[] | null
  user?: PublicUserType | null
}

const Cart = ({ cartData, user }: CartProps) => {
  const { cart } = useCart()
  const [cartDefault, setCartDefault] = useState(cartData)
  useEffect(() => {
    setCartDefault(null)
  }, [cart.length])

  return (
    <>
      {cart.length === 0 && (cartDefault?.length === 0 || !cartDefault) ? (
        <div className="relative w-1/2 mx-auto aspect-[4/3]">
          <Image src={'/images/no-items-removebg.png'} fill alt="no-items" />
        </div>
      ) : (
        <>
          <ul className="w-full lg:w-2/3 flex flex-col gap-y-4 divide-zinc-600 ">
            <div className="mt-6 flex w-full divide-x border-b pb-2">
              <h6 className="w-5/12 px-4">Products</h6>
              <h6 className="w-2/12 px-4">Quantity</h6>
              <h6 className="w-3/12 px-4">Subtotal</h6>
            </div>

            {(cart.length > 0 ? cart : cartDefault || []).map(cartItem => (
              <CartIem
                productId={cartItem.productId}
                quantity={cartItem.quantity}
                key={cartItem.productId}
              />
            ))}
          </ul>
          <Checkout user={user} />
        </>
      )}
    </>
  )
}

export default Cart
