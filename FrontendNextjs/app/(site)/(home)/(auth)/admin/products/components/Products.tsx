'use client'

//list product
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import useLoading from '@/app/hooks/useLoading'
import Button from './Button'
import MultiRangeSlider from 'multi-range-slider-react'
import DataTable from './DataTable'
import SearchBar from './SearchBar'
import { IoAddCircleOutline } from 'react-icons/io5'
import { RiArrowDropDownLine } from 'react-icons/ri'
import { useQuery } from 'react-query'
import { useRouter } from 'next/navigation'
import { Product } from '@prisma/client'

interface SearchProps {
  name: string
  minPrice?: string
  maxPrice?: string
  categoryId?: string
  status: string
}

interface SearchConfigProps {
  search: SearchProps
  page: number
  limit: number
}
interface ProductsProps {
  totalCount: number
  products: Product[]
}
const Products = ({ products, totalCount }: ProductsProps) => {
  const [minProductPrice, setMinProductPrice] = useState<number>(0)
  const [maxProductPrice, setMaxProductPrice] = useState<number>(0)
  const router = useRouter()
  const { loading } = useLoading()
  //categories
  const [categories, setCategories] = useState([])

  const [priceRangeActive, setPriceRangeActive] = useState(false)
  const handlePriceRangeClick = () => {
    setPriceRangeActive(!priceRangeActive)
  }

  // hide caption
  useEffect(() => {
    const priceRangeElement = document.getElementById('price-range')
    if (priceRangeElement) {
      const captions = priceRangeElement.querySelectorAll('.caption')
      captions.forEach(caption => {
        caption.classList.add('hidden')
        caption.classList.remove('caption')
      })
    }
  }, [])

  const [searchConfig, _setSearchConfig] = useState<SearchConfigProps>({
    search: {
      name: '',
      maxPrice: '',
      minPrice: '',
      categoryId: '',
      status: '0',
    },
    page: 1,
    limit: 10,
  })
  const setSearchConfig = (searchConfig: any) => {
    _setSearchConfig(searchConfig)
  }

  const handlePriceRange = (e: any) => {
    setSearchConfig({
      ...searchConfig,
      search: {
        ...searchConfig.search,
        minPrice: e.minValue,
        maxPrice: e.maxValue,
      },
    })
  }

  //get min max price
  useEffect(() => {
    const url = `/api/products/price/minmax`
    axios({
      method: 'get',
      url: url,
    })
      .then(response => {
        setMinProductPrice(response.data.data.minPrice)
        setMaxProductPrice(response.data.data.maxPrice)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  const { data } = useQuery({
    queryKey: ['products', ...Object.values(searchConfig)],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/products', {
          params: {
            page: searchConfig.page,
            limit: searchConfig.limit,
            ...searchConfig.search,
          },
        })
        return res.data.data
      } catch (error) {
        return { products: [], totalCount: 0 }
      }
    },
    keepPreviousData: true,
    initialData: {
      products,
      totalCount,
    },
  })

  //get categories
  useEffect(() => {
    axios({
      method: 'get',
      url: '/api/categories',
    })
      .then(response => {
        setCategories(response.data.data.categories)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

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

  const handleSearch = (
    search: String,
    type: 'name' | 'minPrice' | 'maxPrice' | 'categoryId' | 'status',
  ) => {
    setSearchConfig({
      ...searchConfig,
      search: {
        ...searchConfig.search,
        [type]: search,
      },
    })
  }

  const handleShowing = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchConfig({
      ...searchConfig,
      page: 1,
      limit: parseInt(event.target.value),
    })
  }

  const handleAddProduct = () => {
    loading()
    router.push('/admin/products/add-product')
  }

  const handleEditProduct = (id: String) => {
    loading()
    router.push(`/admin/products/${id}`)
  }

  const formatNumberWithCommas = (number: any) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  return (
    <>
      {/* Search bar */}
      <div className="bg-white px-6 rounded-lg  w-full mb-3 p-2">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <div className="flex gap-2 flex-wrap justify-between items-center">
              <h1 className="text-xl text-gray-500 font-semibold ml-2">Products</h1>
              <span className="mx-2 text-slate-300 text-3xl font-light">|</span>
              {/* filter */}
              <div className="flex gap-2">
                {/*  2 select input for price range*/}
                <div id="price-range" className="relative">
                  {/* price range button*/}
                  <div className="flex flex-col justify-between items-center h-full text-gray-900 text-sm">
                    <button
                      className="border border-gray-300 rounded-md h-full flex items-center"
                      onClick={handlePriceRangeClick}
                    >
                      <span className={` py-2.5 pl-2.5 `}>Price</span>
                      <span className={`text-3xl`}>
                        <RiArrowDropDownLine />
                      </span>
                    </button>
                    <div className={`relative`}>
                      <div
                        className={`absolute top-0 min-w-56 ${
                          priceRangeActive ? 'block' : 'hidden'
                        }`}
                      >
                        <div className="bg-slate-50 border rounded-lg py-5 px-3 mt-2">
                          <h3 className=" text-slate-700 text-sm font-semibold mb-3">
                            Price(VND):
                          </h3>
                          <div className={`flex justify-between mb-1`}>
                            <div className=" p-2  bg-slate-100 mr-1 flex items-center justity-center">
                              <span className="text-slate-700 text-sm">
                                {searchConfig.search.minPrice
                                  ? formatNumberWithCommas(searchConfig.search.minPrice)
                                  : formatNumberWithCommas(
                                      minProductPrice + (maxProductPrice - minProductPrice) / 3,
                                    )}
                              </span>
                            </div>
                            <div className=" p-2  bg-slate-100 mr-1 flex items-center justity-center">
                              <span className="text-slate-700 text-sm">
                                {searchConfig.search.maxPrice
                                  ? formatNumberWithCommas(searchConfig.search.maxPrice)
                                  : formatNumberWithCommas(
                                      maxProductPrice - (maxProductPrice - minProductPrice) / 3,
                                    )}
                              </span>
                            </div>
                          </div>
                          <div>
                            <MultiRangeSlider
                              min={minProductPrice}
                              max={maxProductPrice}
                              step={1000}
                              minValue={
                                searchConfig.search.minPrice
                                  ? searchConfig.search.minPrice
                                  : minProductPrice + (maxProductPrice - minProductPrice) / 3
                              }
                              maxValue={
                                searchConfig.search.maxPrice
                                  ? searchConfig.search.maxPrice
                                  : maxProductPrice - (maxProductPrice - minProductPrice) / 3
                              }
                              style={{ border: 'none', boxShadow: 'none', padding: '15px 10px' }}
                              label={false}
                              ruler={false}
                              preventWheel={false}
                              barLeftColor="slate"
                              barInnerColor="lightskyblue"
                              barRightColor="slate"
                              thumbLeftColor="lavender"
                              thumbRightColor="lavender"
                              onChange={e => {
                                handlePriceRange(e)
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-4 focus:outline-none focus:ring-slate-300 block w-full p-2.5"
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                    handleSearch(event.target.value, 'status')
                  }}
                  value={searchConfig.search.status}
                >
                  <option value="">Status: All</option>
                  <option value="0">Active</option>
                  <option value="1">Inactive</option>
                </select>

                {/* categories */}
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-4 focus:outline-none focus:ring-slate-300 block w-full p-2.5"
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                    handleSearch(event.target.value, 'categoryId')
                  }}
                >
                  <option value="">Category: All</option>
                  {categories.map((category: any) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {/* remove filter */}
                <button
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-4 focus:outline-none focus:ring-slate-300 block w-full"
                  onClick={() => {
                    setSearchConfig({
                      ...searchConfig,
                      search: {
                        ...searchConfig.search,
                        name: '',
                        minPrice: '',
                        maxPrice: '',
                        categoryId: '',
                        status: '',
                      },
                    })
                  }}
                >
                  <span className={` py-2.5 px-1.5 w-full`}>Remove Filter</span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex">
            <SearchBar
              name="search"
              placeholder="Search by Product Name"
              value={searchConfig.search.name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleSearch(event.target.value, 'name')
              }}
            />
            <Button
              title="Add Product"
              size="lg"
              icon={<IoAddCircleOutline />}
              color="primary"
              onClick={handleAddProduct}
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
                data={data?.products}
                showing={searchConfig.limit}
                isNextPage={searchConfig.page * searchConfig.limit < (data?.totalCount || 0)}
                isPrevPage={searchConfig.page > 1}
                handleClickItem={handleEditProduct}
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

export default Products
