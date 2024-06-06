'use client'

import Link from 'next/link'
import CategoryItem from './CategoryItem'
import { Category } from '@prisma/client'
import useLoading from '@/app/hooks/useLoading'

interface CategoriesProps {
  categories: Category[]
}

const Categories = ({ categories }: CategoriesProps) => {
  const { loading } = useLoading()
  return (
    <div className="px-[2rem] xl:px-[10rem]">
      <div className="flex justify-between text-gray-700">
        <h5 className="text-2xl font-semibold">Shop by Categories</h5>
        <Link className="text-sm hover:text-black underline" href="/categories" onClick={loading}>
          Show All
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-6 xl:gap-12">
        {categories.map(category => (
          <CategoryItem key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}

export default Categories
