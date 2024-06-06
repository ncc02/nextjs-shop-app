'use client'

import React, { useState } from 'react'
import axios from 'axios'
import useLoading from '@/app/hooks/useLoading'
import { IoAddCircleOutline } from 'react-icons/io5'
import { useRouter } from 'next/navigation'
import { useQuery } from 'react-query'
import { Category } from '@prisma/client'
import SearchBar from './SearchBar'
import Button from './Button'
import DataTable from './DataTable'

interface SearchProps {
  name: string
}

interface SearchConfigProps {
  search: SearchProps
  page: number
  limit: number
}
interface CategoriesProps {
  categories: Category[]
  totalCount: number
}
const Categories = ({ categories, totalCount }: CategoriesProps) => {
  const { loading } = useLoading()
  const router = useRouter()

  const [searchConfig, setSearchConfig] = useState<SearchConfigProps>({
    search: {
      name: '',
    },
    page: 1,
    limit: 10,
  })

  const { data } = useQuery({
    queryKey: ['categories', searchConfig.page, searchConfig.limit, searchConfig.search.name],
    queryFn: async () => {
      try {
        const res = await axios.get<{ data: { categories: Category[]; totalCount: number } }>(
          '/api/categories',
          {
            params: { ...searchConfig, ...searchConfig.search },
          },
        )
        return res.data.data
      } catch (error) {
        return {
          categories: [],
          totalCount: 1,
        }
      }
    },
    keepPreviousData: true,
    initialData: { categories, totalCount },
  })

  //handle next page
  const handleNextPage = () => {
    if (searchConfig.page * searchConfig.limit >= (data?.totalCount || 0)) {
      return
    }
    setSearchConfig({
      ...searchConfig,
      page: searchConfig.page + 1,
    })
  }

  const handlePrevPage = () => {
    if (searchConfig.page <= 1) {
      return
    }
    setSearchConfig({
      ...searchConfig,
      page: searchConfig.page - 1,
    })
  }

  const handleShowing = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchConfig({
      ...searchConfig,
      page: 1,
      limit: parseInt(event.target.value),
    })
  }

  return (
    <>
      {/* Search bar */}
      <div className="bg-white px-6 rounded-lg  w-full mb-3 p-2">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <div className="flex gap-2">
              <h1 className="text-xl text-gray-500 font-semibold ">Categories</h1>
              {/* <MultiRange/> */}
            </div>
          </div>
          <div className="flex">
            <SearchBar
              name="search"
              placeholder="Search by Name"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setSearchConfig({
                  ...searchConfig,
                  search: {
                    name: event.target.value,
                  },
                })
              }}
            />
            <Button
              title="Add Category"
              size="lg"
              icon={<IoAddCircleOutline />}
              color="primary"
              onClick={() => {
                loading()
                router.push('/admin/categories/add')
              }}
            />
          </div>
        </div>
      </div>

      {/* content */}
      <div className="bg-white px-6 rounded-lg  w-full mb-3">
        <div className="p-2">
          <div className="p-2"></div>
          <div className="">
            <div className="flex flex-wrap ">
              <DataTable
                data={data?.categories}
                showing={searchConfig.limit}
                isNextPage={searchConfig.page * searchConfig.limit < (data?.totalCount || 0)}
                isPrevPage={searchConfig.page > 1}
                handleClickItem={id => {
                  router.push(`/admin/categories/${id}`)
                }}
                handleNextPage={handleNextPage}
                handlePrevPage={handlePrevPage}
                handleShowing={handleShowing}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Categories
