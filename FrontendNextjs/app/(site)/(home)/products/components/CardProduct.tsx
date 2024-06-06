'use client'
import React from 'react'
import Image from 'next/image'
import { Product } from '@prisma/client'
import Link from 'next/link'
import { FaCartShopping } from 'react-icons/fa6'
import useCart from '@/app/hooks/useCart'
import toast from 'react-hot-toast'

const CardProduct = ({ product }: { product: Product | any }) => {
  const { addToCart } = useCart()
  const [src, setSrc] = React.useState(
    product.images[0] || 'https://img.lovepik.com/element/40021/7866.png_1200.png',
  )
  return (
    <div className=" bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl w-full relative group">
      <div>
        <Link href={`/products/${product.id}`}>
          <Image
            placeholder="blur"
            blurDataURL={
              'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzdlanU2d3JvZGh2dDFjc29iOG43NjNjbnR6bmdqbXc0anZieTM4aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/YMM6g7x45coCKdrDoj/giphy.gif'
            }
            src={src}
            width="0"
            height="0"
            sizes="100vw"
            className="h-80 w-full object-cover rounded-t-xl"
            alt={product.name}
            onError={() => setSrc('https://img.lovepik.com/element/40021/7866.png_1200.png')}
          />
        </Link>
        <div className="px-4 py-3 w-full">
          <Link href={`/products/${product.id}`}>
            <span className="text-gray-400 mr-3 uppercase text-xs">
              {product.category[0]?.name || 'Brand'}
            </span>
            <p className="text-lg font-bold text-black truncate block capitalize">{product.name}</p>
            <p className="text-sm text-gray-500 truncate block my-2">{product.quantity} items</p>
          </Link>
          <div className="flex items-center w-full">
            <p className="text-lg font-semibold text-black cursor-auto my-3">
              {product.price.toLocaleString('en-US')} VND
            </p>
            <del>
              <p className="text-sm text-gray-600 cursor-auto ml-2">
                {Math.floor(product.price * 1.2).toLocaleString('en-US')} VND
              </p>
            </del>
            <div
              className="ml-auto z-50 cursor-pointer hover:scale-105"
              onClick={() => {
                toast.success('Add success!')
                addToCart({
                  productId: product.id,
                  productPrice: product.price,
                  quantity: 1,
                })
              }}
            >
              <FaCartShopping className="text-2xl text-gray-500 hover:text-gray-700 duration-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardProduct
