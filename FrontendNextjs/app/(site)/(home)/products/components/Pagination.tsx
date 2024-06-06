'use client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { BiArrowToLeft, BiArrowToRight } from 'react-icons/bi'

interface PaginationProps {
  totalItems: number
}

const Pagination = ({ totalItems }: PaginationProps) => {

  const searchParams = useSearchParams()
  const router = useRouter()

  const [currentPage, setCurrentPage] = useState(searchParams.get('page')?parseInt(searchParams.get('page')!):1)
  let itemsPerPage = 15
  const pageSize = searchParams.get('pageSize')
  if (pageSize) {
    itemsPerPage = parseInt(pageSize)
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const prevPage = currentPage - 1 > 0 ? currentPage - 1 : 1
  const nextPage = currentPage< totalPages ? currentPage + 1 : currentPage

  const pageNumbers = []
  const offsetNumber = itemsPerPage
  for (let i = currentPage - offsetNumber; i <= currentPage + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i)
    }
  }
  const handlePagination = (value:string)=>{
    const params = new URLSearchParams(searchParams.toString())
      params.set('page', value)
      router.push(`/products?${params.toString()}`)
  }
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 w-full mt-6">
      <div className="flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{totalItems>0?(currentPage-1)*itemsPerPage+1:0}</span> to{' '}
            <span className="font-medium">{currentPage*itemsPerPage<totalItems?currentPage*itemsPerPage:totalItems}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <div
              onClick={()=>{
                setCurrentPage(prevPage)
                handlePagination(prevPage.toString())
              }}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:z-20 focus:outline-offset-0 cursor-pointer"
            >
              <span className="sr-only">Previous</span>
              <BiArrowToLeft className="h-5 w-5" aria-hidden="true" />
            </div>
            {pageNumbers.map(number => (
              <div
              onClick={()=>{
                setCurrentPage(number)
                handlePagination(number.toString())
              }} 
              key={number}
              className={`relative z-10 inline-flex items-center ${currentPage==number?'bg-indigo-600 text-white ' :'text-gray-950'}  px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer hover:bg-gray-300`}>
                {number}
              </div>
            ))}

            <div
              onClick={()=>{
                setCurrentPage(nextPage)
                handlePagination(nextPage.toString())
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
