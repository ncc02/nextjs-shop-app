'use client'

import { Import, Product } from '@prisma/client'
import axios from 'axios'
import clsx from 'clsx'
import { format } from 'date-fns'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa'
import { useQuery } from 'react-query'
import DataTable from './DataTable'
import SearchBar from './SearchBar'
import useLoading from '@/app/hooks/useLoading'

interface SearchConfigProps {
  name?: string
  productId?: string
  from?: Date
  to?: Date
  page: number
  limit: number
  orderBy: 'desc' | 'asc'
}
interface ImportedsProps {
  imports: (Import & { product: Product })[]
  totalCount: number
}
const Importeds = ({ imports, totalCount }: ImportedsProps) => {
  const router = useRouter()
  const { loading } = useLoading()
  const searchParams = useSearchParams()

  const [searchConfig, setSearchConfig] = useState<SearchConfigProps>({
    name: '',
    from: undefined,
    to: undefined,
    productId: searchParams.get('productId') || undefined,
    page: 1,
    limit: 10,
    orderBy: 'desc',
  })

  const { data } = useQuery({
    queryKey: ['imports', ...Object.values(searchConfig)],
    queryFn: async () => {
      try {
        const res = await axios.get<{
          data: { totalCount: number; imports: (Import & { product: Product })[] }
        }>('/api/imports', { params: searchConfig })
        return res.data.data
      } catch (error) {
        return {
          imports: [],
          totalCount: 0,
        }
      }
    },
    keepPreviousData: true,
    initialData: {
      imports,
      totalCount,
    },
  })

  //handle next page
  const handleNextPage = () => {
    if (searchConfig.page * searchConfig.limit >= 10) {
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
              <h1 className="text-xl text-gray-500 font-semibold ">Import history</h1>
            </div>
          </div>
          <div className="flex">
            <div className="flex">
              <div className="flex gap-x-4 items-center">
                <div>
                  {searchConfig.orderBy === 'desc' ? (
                    <FaSortAmountDown
                      onClick={() => setSearchConfig({ ...searchConfig, orderBy: 'asc' })}
                    />
                  ) : (
                    <FaSortAmountUp
                      onClick={() => setSearchConfig({ ...searchConfig, orderBy: 'desc' })}
                    />
                  )}
                </div>
                <div className="flex items-center">
                  <label className="font-semibold text-sm mr-2">From</label>
                  <input
                    type="date"
                    value={searchConfig.from ? format(searchConfig.from, 'yyyy-MM-dd') : ''}
                    onChange={e =>
                      setSearchConfig({ ...searchConfig, from: new Date(e.target.value) })
                    }
                    className="border placeholder:text-white text-sm p-1 rounded-md mr-2"
                  />
                  <button
                    className={clsx(
                      'text-xs',
                      searchConfig.from
                        ? 'text-gray-800 font-semibold'
                        : 'text-gray-400 font-normal',
                    )}
                    onClick={() => setSearchConfig({ ...searchConfig, from: undefined })}
                  >
                    Clear
                  </button>
                </div>
                <div className="flex items-center">
                  <label className="font-semibold mr-2 text-sm">To</label>
                  <input
                    type="date"
                    value={searchConfig.to ? format(searchConfig.to, 'yyyy-MM-dd') : ''}
                    onChange={e =>
                      setSearchConfig({ ...searchConfig, to: new Date(e.target.value) })
                    }
                    className="text-sm border placeholder:text-white p-1 rounded-md mr-2"
                  />
                  <button
                    className={clsx(
                      'text-xs mr-2',
                      searchConfig.to ? 'text-gray-800 font-semibold' : 'text-gray-400 font-normal',
                    )}
                    onClick={() => setSearchConfig({ ...searchConfig, to: undefined })}
                  >
                    Clear
                  </button>
                </div>
              </div>
              <SearchBar
                name="search"
                placeholder="Search by Name"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchConfig({
                    ...searchConfig,
                    name: event.target.value,
                  })
                }}
              />
            </div>
          </div>
        </div>
        {searchConfig.productId && (
          <div className="flex">
            <div className="font-semibold text-gray-400">Filter by {searchConfig.productId}</div>
            <button
              onClick={() => setSearchConfig({ ...searchConfig, productId: undefined })}
              className="text-gray-700 font-semibold text-sm ml-4"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* content */}
      <div className="bg-white min-h-[60vh] px-6 rounded-lg  w-full mb-3">
        <div className="p-2">
          <div className="p-2"></div>
          <div className="">
            <div className="flex flex-wrap ">
              <DataTable
                data={data?.imports}
                showing={searchConfig.limit}
                isNextPage={searchConfig.page * searchConfig.limit < (data?.totalCount || 0)}
                isPrevPage={searchConfig.page > 1}
                handleActionClick={id => {
                  loading()
                  router.push(`/admin/imports/${id}`)
                }}
                handleClickItem={id => {
                  setSearchConfig({ ...searchConfig, productId: id })
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

export default Importeds
