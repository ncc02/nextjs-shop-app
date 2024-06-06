'use client'

import useImage from '@/app/hooks/useImage'
import useLoading from '@/app/hooks/useLoading'
import { Product } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface ProductItemProps {
  product: Product
}

const ProductItem = ({ product }: ProductItemProps) => {
  const { loading } = useLoading()
  const { setUrl } = useImage()
  const [src, setSrc] = useState(
    product.images[0] || 'https://img.lovepik.com/element/40021/7866.png_1200.png',
  )
  return (
    <div>
      <div
        className="relative aspect-[4/3] rounded-md overflow-hidden bg-slate-50"
        onClick={() => setUrl(product.images[0])}
      >
        <Image
          alt={product.id}
          src={src}
          className="h-full object-scale-down"
          fill
          onError={() => setSrc('https://img.lovepik.com/element/40021/7866.png_1200.png')}
        />
      </div>
      <Link
        className="block w-full text-lg font-semibold text-gray-600 hover:text-gray-800 mt-2 truncate text-ellipsis"
        href={`/products/${product.id}`}
        onClick={loading}
      >
        {product.name}
      </Link>
      <p className="text-md font-light text-gray-600 truncate text-ellipsis mt-1">
        {product.description}
      </p>
      <p className="text-md font-light text-gray-600 truncate text-ellipsis">${product.price}</p>
    </div>
  )
}

export default ProductItem
