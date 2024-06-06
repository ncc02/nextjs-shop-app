'use client'

import useLoading from '@/app/hooks/useLoading'
import { Category } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface CategoryItemProps {
  category: Category
}

const CategoryItem = ({ category }: CategoryItemProps) => {
  const { loading } = useLoading()
  const [src, setSrc] = useState(
    category.image || 'https://img.lovepik.com/element/40021/7866.png_1200.png',
  )
  return (
    <div
      className={`bg-slate-50 hover:bg-slate-100 rounded-md flex flex-col shadow-sm relative px-8`}
    >
      <div className="relative aspect-square">
        <Image
          alt={category.id}
          src={src}
          fill
          onError={() => setSrc('https://img.lovepik.com/element/40021/7866.png_1200.png')}
        />
      </div>
      <Link
        className="block truncate absolute rounded-md left-4 right-4 bottom-4 p-2 text-center bg-white hover:bg-gray-50 text-sm md:text-md lg:text-lg shadow-sm text-gray-800 hover:text-black"
        href={`/products?categoryId=${category.id}`}
        onClick={loading}
      >
        {category.name}
      </Link>
    </div>
  )
}

export default CategoryItem
