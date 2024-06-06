'use client'

import { Category } from '@prisma/client'

import Pagination from './Pagination'
import CategoryItem from '../../components/CategoryItem'
import NavTitle from './NavTitle'
import { useState } from 'react'
import { useQuery } from 'react-query'
import axios from 'axios'
import Banner from './Banner'
import Link from 'next/link'

interface CategoriesProps {
  categories: Category[]
  totalCount?: number
}

const Categories = ({ categories, totalCount = 0 }: CategoriesProps) => {
  const [searchParams, setSearchParams] = useState<{
    name: string
    page: number
    pageSize: number
    orderBy: 'asc' | 'desc'
  }>({
    name: '',
    page: 1,
    pageSize: 9,
    orderBy: 'asc',
  })

  const { data } = useQuery({
    queryKey: [
      'categories',
      searchParams.name,
      searchParams.page,
      searchParams.pageSize,
      searchParams.orderBy,
    ],
    queryFn: async (): Promise<{ categories: Category[]; totalCount: number }> => {
      try {
        const res = await axios.get<{ data: { categories: Category[]; totalCount: number } }>(
          '/api/categories',
          { params: searchParams },
        )
        return res.data.data
      } catch (error) {
        console.log(error)
        return { categories: [], totalCount: 0 }
      }
    },
    keepPreviousData: true,
    initialData: { categories, totalCount },
  })

  return (
    <div className="w-full h-full flex pb-20 gap-10">
      <div className="w-[20%] lg:w-[25%] hidden md:inline-flex h-[80vh] flex-col gap-6 bg-white px-6 py-9 rounded-md">
        <NavTitle title="Shop by Category" icons={false} />
        <div>
          <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
            {categories.map(({ id, name }) => (
              <li key={id}>
                <Link
                  href={`/products?categoryId=${id}`}
                  className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center justify-between hover:text-slate-900 cursor-pointer"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="w-full md:w-[80%] lg:w-[75%] h-full flex flex-col gap-10">
        <Banner searchParams={searchParams} setSearchParams={setSearchParams} />
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 md:gap-4 lg:gap-10 min-h-[60vh]">
            {data?.categories && data?.categories.length === 0 ? (
              <div className="col-span-3 flex justify-center items-center">
                <p className="text-2xl font-semibold text-gray-500">No categories found</p>
              </div>
            ) : (
              data?.categories.map(category => (
                <div key={category.id}>
                  <CategoryItem category={category} />
                </div>
              ))
            )}
          </div>
          <div className="flex flex-col md:flex-row justify-center md:justify-between items-center">
            <Pagination
              totalItems={data?.totalCount!}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Categories
