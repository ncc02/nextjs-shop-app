'use client'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction } from 'react'
import { BiArrowToLeft, BiArrowToRight } from 'react-icons/bi'

interface PaginationProps {
  totalItems: number
  searchParams: {
    name: string
    page: number
    pageSize: number
    orderBy: 'asc' | 'desc'
  }
  setSearchParams: Dispatch<
    SetStateAction<{
      name: string
      page: number
      pageSize: number
      orderBy: 'asc' | 'desc'
    }>
  >
}

const Pagination = ({ totalItems, searchParams, setSearchParams }: PaginationProps) => {

  const totalPages = Math.ceil(totalItems / searchParams.pageSize)
  const prevPage = searchParams.page - 1 > 0 ? searchParams.page - 1 : 1
  const nextPage = searchParams.page < totalPages ? searchParams.page + 1 : searchParams.page

  const pageNumbers = []
  const offsetNumber = searchParams.pageSize
  for (let i = searchParams.page - offsetNumber; i <= searchParams.page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i)
    }
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 w-full mt-6">
      <div className="flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">
              {totalItems > 0 ? (searchParams.page - 1) * searchParams.pageSize + 1 : 0}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {searchParams.page * searchParams.pageSize < totalItems
                ? searchParams.page * searchParams.pageSize
                : totalItems}
            </span>{' '}
            of <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <div
              onClick={() => {
                setSearchParams({ ...searchParams, page: prevPage })
              }}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:z-20 focus:outline-offset-0 cursor-pointer"
            >
              <span className="sr-only">Previous</span>
              <BiArrowToLeft className="h-5 w-5" aria-hidden="true" />
            </div>
            {pageNumbers.map(number => (
              <div
                onClick={() => {
                  setSearchParams({ ...searchParams, page: number })
                }}
                key={number}
                className={`relative z-10 inline-flex items-center ${
                  searchParams.page == number ? 'bg-indigo-600 text-white ' : 'text-gray-950'
                }  px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer hover:bg-gray-300`}
              >
                {number}
              </div>
            ))}

            <div
              onClick={() => {
                setSearchParams({ ...searchParams, page: nextPage })
              }}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:z-20 focus:outline-offset-0 cursor-pointer"
            >
              <span className="sr-only">Next</span>
              <BiArrowToRight className="h-5 w-5" aria-hidden="true" />
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Pagination
