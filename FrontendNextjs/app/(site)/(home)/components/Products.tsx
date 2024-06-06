'use client'

import Link from 'next/link'
import ProductItem from './ProductItem'
import Pagination from './Pagination'
import { useState } from 'react'
import { Product } from '@prisma/client'
import { usePathname } from 'next/navigation'
import useLoading from '@/app/hooks/useLoading'
import { useQuery } from 'react-query'
import axios from 'axios'

interface ProductsProps {
  products: Product[]
  page: number
  max: number
}

const Products = ({ products, page, max }: ProductsProps) => {
  const { loading } = useLoading()
  const [pageIndex, setPageIndex] = useState(page)
  const pathname = usePathname()

  const { data } = useQuery({
    queryKey: ['products', pageIndex],
    queryFn: async (): Promise<{ products: Product[]; max: number }> => {
      try {
        const res = await axios.get<{ data: { products: Product[]; totalCount: number } }>(
          'api/products',
          {
            params: {
              page: pageIndex,
              pageSize: 6,
            },
          },
        )
        return {
          products: res.data.data.products,
          max: res.data.data.totalCount,
        }
      } catch (error) {
        return {
          products: [],
          max: 0,
        }
      }
    },
    keepPreviousData: true,
    initialData: { products, max },
  })

  return (
    <div className="px-[2rem] xl:px-[10rem]">
      <div className="flex justify-between text-gray-700">
        <h5 className="text-2xl font-semibold">Products</h5>
        <Link className="text-sm hover:text-black underline" href="/products" onClick={loading}>
          Show All
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-6 xl:gap-12">
        {data?.products.map(product => (
          <ProductItem product={product} key={product.id} />
        ))}
      </div>
      <Pagination
        current={pageIndex}
        className="mt-4 mb-8"
        max={max}
        onNext={() => {
          setPageIndex(pageIndex + 1)
          window.history.replaceState('', '', `${pathname}?page=${pageIndex + 1}`)
          return
        }}
        onPrev={() => {
          setPageIndex(pageIndex - 1)
          window.history.replaceState('', '', `${pathname}?page=${pageIndex - 1}`)
          return
        }}
      />
    </div>
  )
}

export default Products
