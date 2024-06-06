'use client'

import NumberInput from '@/app/(site)/components/inputs/NumberInput'
import useCart from '@/app/hooks/useCart'
import { Product } from '@prisma/client'
import axios from 'axios'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { FaTrash } from 'react-icons/fa'
import { useQuery } from 'react-query'

interface CartItemProps {
  productId: string
  quantity: number
}

const CartItem = ({ productId, quantity }: CartItemProps) => {
  const { updateCartItem, removeCartItem } = useCart()
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async (): Promise<Product | null> => {
      try {
        const res = await axios.get<{ data: { product: Product } }>(`api/products/${productId}`)
        return res.data.data.product
      } catch (error) {
        return null
      }
    },
    keepPreviousData: true,
  })
  const onChangeQuantity = (value: number) => {
    if (value > product?.quantity! - product?.sold!) return
    if (value <= 0) {
      removeCartItem(productId)
    } else {
      updateCartItem(productId, value)
    }
  }
  useEffect(() => {
    if (product?.quantity && quantity > product?.quantity - product?.sold)
      updateCartItem(product?.id, product?.quantity - product?.sold)
  }, [product, quantity, updateCartItem])

  if (isLoading && !product) return <CartItemSkeleton quantity={quantity} />
  return (
    <li
      className={clsx(
        'flex w-full items-center divide-x-2',
        (!product?.quantity || product.quantity <= product.sold || !product.isActive) &&
          'bg-gray-300 text-gray-400',
      )}
    >
      {product ? (
        <>
          <div className="w-5/12 flex ">
            <div className="w-20 h-20 bg-gray-200 rounded-md flex justify-center items-center">
              <div className="relative">
                <Image
                  src={product.images[0]}
                  width={100}
                  height={100}
                  alt={product.id}
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex w-20 flex-col flex-1 ml-4 justify-center">
              <Link
                href={`/products/${product.id}`}
                className="truncate text-ellipsis font-semibold text-lg font-serif"
              >
                {product.name}
              </Link>
              <p className="font-light text-sm">${product.price}</p>
            </div>
          </div>
          <div className="w-2/12">
            <NumberInput
              value={quantity}
              onChange={onChangeQuantity}
              disabled={product.quantity <= product.sold || !product.isActive}
            />
          </div>
          <div className="w-3/12 font-light text-end px-4">${quantity * product.price}</div>
        </>
      ) : (
        <div className="w-11/12 bg-gray-200 h-20 rounded-md px-10 py-7">Invalid product</div>
      )}
      <div
        className="w-1/12 flex justify-center cursor-pointer"
        onClick={() => removeCartItem(productId)}
      >
        <FaTrash />
      </div>
    </li>
  )
}
export default CartItem

const CartItemSkeleton = ({ quantity }: { quantity: number }) => {
  return (
    <div className={`w-full flex items-center animate-pulse`}>
      <div className="w-5/12 flex ">
        <div className="relative rounded-md p-4 bg-gray-200 w-20 h-20 "></div>
        <div className="flex flex-col ml-4 justify-center gap-2">
          <div className="w-40 h-5 bg-gray-200 "></div>
          <p className="w-20 h-4 bg-gray-200 "></p>
        </div>
      </div>
      <div className="w-2/12">
        <NumberInput value={quantity} onChange={() => {}} />
      </div>
      <div className="w-3/12 font-light flex justify-end px-4">
        <div className="bg-gray-200 h-5  w-20"></div>
      </div>
      <div className="w-1/12 flex justify-center">
        <FaTrash />
      </div>
    </div>
  )
}
