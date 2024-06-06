'use client'

import { GrFormNext, GrFormPrevious } from 'react-icons/gr'
import Button from './Button'
import OrderViews from './OrderItem'
import { useQuery } from 'react-query'
import { useState } from 'react'
import axios from 'axios'
import clsx from 'clsx'
import { format } from 'date-fns'
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa'

interface OrderListProps {
  orders: any[]
  totalCount: number
}

const OrderListView = ({ orders, totalCount }: OrderListProps) => {
  const [searchParams, setSearchParams] = useState<{
    page: number
    pageSize: number
    from: Date | undefined
    to: Date | undefined
    orderBy: 'asc' | 'desc'
  }>({
    page: 1,
    pageSize: 6,
    from: undefined,
    to: undefined,
    orderBy: 'desc',
  })
  const { data } = useQuery({
    queryKey: [
      'orders',
      searchParams.page,
      searchParams.pageSize,
      searchParams.from,
      searchParams.to,
      searchParams.orderBy,
    ],
    queryFn: async (): Promise<{ orders: any[]; totalCount: number }> => {
      try {
        const res = await axios.get<{ data: { orders: any[]; totalCount: number } }>(
          '/api/admin/orders',
          {
            params: searchParams,
          },
        )
        return res.data.data
      } catch (error) {
        console.log(error)

        return { orders: [], totalCount: 0 }
      }
    },
    keepPreviousData: true,
    initialData: { totalCount: totalCount, orders: orders },
  })

  return (
    <>
      <div className="flex justify-between items-center mt-2 mb-2">
        <h3 className={`px-3 text-2xl font-bold`}>Orders</h3>
        <div className="flex gap-x-4 items-center">
          <div>
            {searchParams.orderBy === 'desc' ? (
              <FaSortAmountDown
                onClick={() => setSearchParams({ ...searchParams, orderBy: 'asc' })}
              />
            ) : (
              <FaSortAmountUp
                onClick={() => setSearchParams({ ...searchParams, orderBy: 'desc' })}
              />
            )}
          </div>
          <div className="flex items-center">
            <label className="font-semibold text-lg mr-2">From</label>
            <input
              type="date"
              value={searchParams.from ? format(searchParams.from, 'yyyy-MM-dd') : ''}
              onChange={e => setSearchParams({ ...searchParams, from: new Date(e.target.value) })}
              className="border placeholder:text-white p-1 rounded-md mr-2"
            />
            <button
              className={clsx(
                searchParams.from ? 'text-gray-800 font-semibold' : 'text-gray-400 font-normal',
              )}
              onClick={() => setSearchParams({ ...searchParams, from: undefined })}
            >
              Clear
            </button>
          </div>
          <div className="flex items-center">
            <label className="font-semibold text-lg mr-2">To</label>
            <input
              type="date"
              value={searchParams.to ? format(searchParams.to, 'yyyy-MM-dd') : ''}
              onChange={e => setSearchParams({ ...searchParams, to: new Date(e.target.value) })}
              className="border placeholder:text-white p-1 rounded-md mr-2"
            />
            <button
              className={clsx(
                searchParams.to ? 'text-gray-800 font-semibold' : 'text-gray-400 font-normal',
              )}
              onClick={() => setSearchParams({ ...searchParams, to: undefined })}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
      <div>
        {data?.orders.map(order => (
          <OrderViews order={order} key={order.id} />
        ))}
      </div>
      <div className="w-full">
        <div className="w-full flex justify-between py-3">
          <div className="flex ">
            <div className="flex items-center">
              <select
                id="isActive"
                name="isActive"
                value={String(searchParams.pageSize)}
                onChange={e =>
                  setSearchParams({ ...searchParams, pageSize: Number.parseInt(e.target.value) })
                }
                className="bg-transparent text-slate-500 text-sm rounded-lg focus:ring-4 focus:outline-none focus:ring-slate-300 block w-full p-1"
                required
              >
                <option value="6">Showing: 6</option>
                <option value="10">Showing: 10</option>
                <option value="20">Showing: 20</option>
              </select>
            </div>
          </div>
          <div className="flex">
            <Button
              title="Prev"
              size="md"
              onClick={() => setSearchParams({ ...searchParams, page: searchParams.page - 1 })}
              icon={<GrFormPrevious />}
              disabled={searchParams.page < 2}
              color="light"
            />

            <Button
              title="Next"
              size="md"
              reverse={true}
              onClick={() => setSearchParams({ ...searchParams, page: searchParams.page + 1 })}
              icon={<GrFormNext />}
              disabled={
                searchParams.page * searchParams.pageSize >= (data?.totalCount || totalCount)
              }
              color="light"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderListView
