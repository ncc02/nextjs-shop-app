'use client'
import { Category, Product } from '@prisma/client'
import ProductImage from './ProductImage'
import ProductQuantityActions from './ProductQuantityActions'
import { useEffect } from 'react'
import axios from 'axios'

interface ProductInfoProps {
  product: Product
  category: Category[]
}

const ProductInfo = ({ category, product }: ProductInfoProps) => {
  useEffect(() => {
    axios
      .post('/api/collect', {
        type: 'Care',
        productId: product.id,
      })
      .catch(_err => {})
  })
  return (
    <>
      <div className="flex flex-col justify-between lg:flex-row gap-16 lg:items-center pb-7 bg-white px-2 lg:px-14 rounded-md">
        <ProductImage images={product.images} />
        <div className="flex flex-col gap-4 lg:w-2/4">
          <div>
            <span className=" text-violet-600 font-semibold">{category[0]?.name || ''}</span>
            <h1 className="text-3xl font-bold">{product.name}</h1>
          </div>
          <p className="text-gray-700">{product.description}</p>
          <div className="text-2xl font-semibold flex items-center gap-6">
            {product.price.toLocaleString('en-US')} VND{' '}
            {product.quantity - product.sold < 1 && (
              <button className="bg-red-600 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed text-sm">
                Sold out
              </button>
            )}
          </div>
          <ProductQuantityActions product={product} />
        </div>
      </div>
    </>
  )
}
export default ProductInfo
