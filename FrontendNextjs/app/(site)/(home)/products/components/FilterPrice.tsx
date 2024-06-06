'use client'
import { useState } from 'react'
import NavTitle from './NavTitle'
import { useRouter, useSearchParams } from 'next/navigation'

const Price = () => {
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const route = useRouter()
  const searchParams = useSearchParams()

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('minPrice', minPrice)
    params.set('maxPrice', maxPrice)
    route.push(`/products?${params.toString()}`)
  }
  return (
    <div className="cursor-pointer">
      <NavTitle title="Shop by Price" icons={false} />
      <div className="font-titleFont">
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          <li className="flex flex-row gap-1 items-center justify-between">
            <p>Min Price   :</p>

            <input
              type="text"
              className="max-w-[50%] outline-none border-2 rounded-md border-gray-300 p-1 font-medium"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
            />
            <p>VND</p>
          </li>
          <li className="flex flex-row gap-1 items-center justify-between">
            <p>Max Price :</p>

            <input
              type="text"
              className="max-w-[50%] outline-none border-2 rounded-md border-gray-300 p-1 font-medium"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
            />
            <p>VND</p>
          </li>
        </ul>
        <div
          onClick={() => handleSearch()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded max-w-[50%] m-auto mt-4 text-center"
        >
          Filter Price
        </div>
      </div>
    </div>
  )
}

export default Price
