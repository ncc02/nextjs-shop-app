'use client'

import { Order } from '@prisma/client'
import OrderViews from './OrderViews'
import axios from 'axios'
import { useState } from 'react'
import { GrFormNext, GrFormPrevious } from 'react-icons/gr'
import { useQuery } from 'react-query'
import Button from '../../components/Button'

const OrderListView = ({ orders, totalCount }: { orders: Order[]; totalCount: number }) => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)

  const { data } = useQuery({
    queryKey: ['my-orders', page, limit],
    queryFn: async () => {
      try {
        const res = await axios.get<{ data: { orders: Order[]; totalCount: number } }>(
          '/api/orders',
          {
            params: {
              page,
              pageSize: limit,
            },
          },
        )
        return res.data.data
      } catch (error) {
        return { orders: [], totalCount: 0 }
      }
    },
    keepPreviousData: true,
    initialData: {
      orders,
      totalCount,
    },
  })
  //handle next page
  const handleNextPage = () => {
    if (page * limit >= (data?.totalCount || 0)) {
      return
    }
    setPage(page + 1)
  }

  //handle prev page
  const handlePrevPage = () => {
    if (page <= 1) {
      return
    }
    setPage(page - 1)
  }

  //handle limit
  const handleShowing = (event: any) => {
    setLimit(event.target.value)
  }
  return (
    <div>
      <div>
        {orders.map((order, i) => (
          <OrderViews key={i} order={order} />
        ))}
      </div>
      <div className="w-full">
        <div className="w-full flex justify-between py-3">
          <div className="flex ">
            <div className="flex items-center">
              <select
                id="isActive"
                name="isActive"
                value={String(limit)}
                onChange={handleShowing}
                className="bg-transparent text-slate-500 text-sm rounded-lg focus:ring-4 focus:outline-none focus:ring-slate-300 block w-full p-1"
                required
              >
                <option value="5">Showing: 5</option>
                <option value="10">Showing: 10</option>
                <option value="20">Showing: 20</option>
              </select>
            </div>
          </div>
          <div className="flex">
            <Button
              title="Prev"
              size="md"
              onClick={handlePrevPage}
              icon={<GrFormPrevious />}
              disabled={page <= 1}
              color="light"
            />

            <Button
              title="Next"
              size="md"
              reverse={true}
              onClick={handleNextPage}
              icon={<GrFormNext />}
              disabled={page * limit >= (data?.totalCount || 0)}
              color="light"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderListView
