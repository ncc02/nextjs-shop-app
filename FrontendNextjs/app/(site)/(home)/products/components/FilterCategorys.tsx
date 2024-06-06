'use client'
import React, { useState } from 'react'
// import { FaPlus } from "react-icons/fa";
import { ImPlus } from 'react-icons/im'
import NavTitle from './NavTitle'
import { Category } from '@prisma/client'
import { useRouter, useSearchParams } from 'next/navigation'

const Category = ({ categorys }: { categorys?: Category[] }) => {
  const searchParams = useSearchParams()

  const [active, setActive] = useState<string>(searchParams.get('categoryId') || 'All')
  const route = useRouter()



  const handleSearch = (id: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if(id == 'All') {
      params.delete('categoryId')
      setActive('All')
      route.push(`/products?${params.toString()}`)
      
    }
    else{
      params.set('categoryId', id)
      setActive(id)
      route.push(`/products?${params.toString()}`)
    }
  }
  return (
    <div className="w-full">
      <NavTitle title="Shop by Category" icons={false} />
      <div>
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          <li
            onClick={() => handleSearch("All")}
            className={`border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center justify-between hover:text-slate-900 ${
              active == 'All' ? 'text-slate-900 font-bold' : ''
            } cursor-pointer`}
          >
            All
          </li>
          {categorys &&
            categorys.map(({ id, name }) => (
              <li
                key={id}
                onClick={() => handleSearch(id)}
                className={`border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center justify-between hover:text-slate-900 ${
                  active == id ? 'text-slate-900 font-bold' : ''
                } cursor-pointer`}
              >
                {name}
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}

export default Category
