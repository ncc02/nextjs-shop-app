'use client'
import Link from 'next/link'
import ItemViews from './ItemViews'

const convertDate = (date: string) => {
  // 2024-01-29T12:30:00Z
  //to
  //Saturdary, 29 January 2024
  const dateObj = new Date(date)
  const weekday = dateObj.toLocaleString('en-us', { weekday: 'long' })
  const day = dateObj.toLocaleString('en-us', { day: 'numeric' })
  const month = dateObj.toLocaleString('en-us', { month: 'long' })
  const year = dateObj.toLocaleString('en-us', { year: 'numeric' })
  return `${weekday}, ${day} ${month} ${year}`
}
const getTotal = (order: any) => {
  let total = 0
  order.orderItems.forEach((item: any) => {
    total += item.price * item.quantity
  })
  return formatNumberWithCommas(total)
}
const formatNumberWithCommas = (number: any) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
const OrderViews = ({ order }: { order: any }) => {
  return (
    <div className="p-2 mb-3">
      {/* Oder Header Wrapper */}
      <div className=" flex justify-between items-center bg-slate-100 border-2 rounded-tl-xl rounded-tr-xl p-3">
        {/* Order Infor */}
        <div className={`bg-slate-100`}>
          <div className="text-slate-500 font-bold text-lg">
            {/* Order Date */}
            <div>{convertDate(order.createdAt)}</div>
          </div>
          <div className={`flex`}>
            {/* Order Count */}
            <div className={`pr-3`}>
              <span className={`uppercase text-sm text-slate-500 `}>item: </span>
              {order.orderItems.length}
            </div>
            {/* Order Total */}
            {/* upcase */}
            <div className={`pr-3`}>
              <span className={`uppercase text-sm text-slate-500 `}>total: </span>
              {getTotal(order)}VND
            </div>
            {/* Order Status */}
          </div>
        </div>

        {/* "Views Order" Button */}
        <div className="flex gap-6 items-center">
          <div
            aria-disabled
            className={`${
              order?.status == 'Canceled' ? 'bg-red-400' : 'bg-green-600'
            }  text-white py-2 px-4 rounded text-base font-medium leading-6`}
          >
            {order?.status || 'Confirmed'}
          </div>
          <Link
            href={`/my-orders/${order.id}`}
            className={` text-slate-700 text-base cursor-pointer hover:text-slate-500`}
          >
            Detail
          </Link>
        </div>
      </div>
      {/* List items */}
      {/* <div className={` border-2 border-gray-300 `}> */}
      <div className={``}>
        <div className={`m-3`}>
          {/* item  */}
          {order.orderItems.map((item: any) => (
            <div key={item.id} className={` border-b-2 border-gray-300 mb-1`}>
              <ItemViews item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OrderViews
