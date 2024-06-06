'use client'
import { Category, Product } from "@prisma/client"
import CardProduct from "./CardProduct"
import ProductBanner from "./ProductBanner"
import ShopSideNav from "./SideNav"
import Pagination from "./Pagination"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
export function Items({ currentItems }: { currentItems: Product[] | null }) {
    return (
      <>
        {currentItems &&
          currentItems.map(item => (
            <div key={item.id} className="w-full">
              <CardProduct product={item}/>
            </div>
          ))}
      </>
    )
  }

interface ProductListProps {
    products: Product[] | null
    totalCount?: number
    categorys: Category[]
}
const ProductList = ({products , totalCount, categorys} : ProductListProps ) => {

    return (
        <div className="w-full h-full flex pb-20 gap-10">
          <div className="w-[20%] lg:w-[25%] hidden md:inline-flex h-full">
            <ShopSideNav categorys={categorys} />
          </div>
          <div className="w-full md:w-[80%] lg:w-[75%] h-full flex flex-col gap-10">
            <ProductBanner  />
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 md:gap-4 lg:gap-10 min-h-[60vh]">
                {products && products.length === 0 && (
                  <div className="col-span-3 flex justify-center items-center">
                    <p className="text-2xl font-semibold text-gray-500">
                      No products found
                      </p>
                      </div>
                      )}
                <Items currentItems={products} />
              </div>
              <div className="flex flex-col md:flex-row justify-center md:justify-between items-center">
                {/* pagnigate vao day */}
                <Pagination
                  totalItems={totalCount!}
              
                />
              </div>
            </div>
          </div>
        </div>
    )
}

export default ProductList