'use client'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { GoTriangleDown } from 'react-icons/go'

interface BannerProps {
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

const Banner = ({ searchParams, setSearchParams }: BannerProps) => {
  const [searchValue, setSearchValue] = useState<string>('')

  const handleSearch = () => {
    setSearchParams(prev => ({ ...prev, name: searchValue }))
  }
  return (
    <div className="w-full flex flex-col md:flex-row md:items-center justify-between">
      <div className="flex items-center min-w-[50%]">
        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">
          Search
        </label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 "
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder=""
            value={searchValue}
            onChange={value => setSearchValue(value.target.value)}
          />
          <button
            onClick={handleSearch}
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 cursor-pointer focus:outline-none font-medium rounded-lg text-sm px-4 py-2 "
          >
            Search
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-6 mt-4 md:mt-0">
        <div className="flex items-center gap-2 text-base text-[#767676] relative">
          <label className="block">Sort by:</label>
          <select
            onChange={e => {
              setSearchParams(prev => ({
                ...prev,
                orderBy: e.target.value === 'desc' ? 'desc' : 'asc',
              }))
            }}
            id="orderBy"
            value={searchParams.orderBy}
            className="w-32 md:w-52 border-[1px] border-gray-200 py-1 px-4 cursor-pointer text-primeColor text-base block appearance-none focus-within:outline-none focus-visible:border-primeColor"
          >
            <option value="asc">A to Z</option>
            <option value="desc">Z to A</option>
          </select>
          <span className="absolute text-sm right-2 md:right-4 top-2.5">
            <GoTriangleDown />
          </span>
        </div>
        <div className="flex items-center gap-2 text-[#767676] relative">
          <label className="block">Show:</label>
          <select
            onChange={e =>
              setSearchParams(prev => ({ ...prev, pageSize: Number.parseInt(e.target.value) }))
            }
            id="pageSize"
            value={searchParams.pageSize || 9}
            className="w-16 md:w-20 border-[1px] border-gray-200 py-1 px-4 cursor-pointer text-primeColor text-base block appearance-none focus-within:outline-none focus-visible:border-primeColor"
          >
            <option value="9">9</option>
            <option value="12">12</option>
            <option value="15">15</option>
          </select>
          <span className="absolute text-sm right-3 top-2.5">
            <GoTriangleDown />
          </span>
        </div>
      </div>
    </div>
  )
}

export default Banner
