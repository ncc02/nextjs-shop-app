'use client'

import Link from 'next/link'
import Avatar from '@/app/(site)/components/Avatar'
import useLoading from '@/app/hooks/useLoading'
import clsx from 'clsx'
import Image from 'next/image'

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

const ItemViews = ({ item }: { item: any }) => {
  return (
    <div className="rounded-md p-2 mb-3 flex justify-between items-center">
      {/* Item Image */}
      <div className="flex flex-1">
        <div className={`mr-2`}>
          <Image
            width={100}
            height={100}
            className="w-8 h-8"
            src={String(item?.product?.images[0])}
            alt="order_image"
          />
        </div>
        {/* Item Header Wrapper */}
        <div className="flex justify-between flex-1">
          <Link className={`font-bold text-sm`} href={`/products/${item.id}`}>
            {item.product.name}
          </Link>
          <div className="">
            <div>Price: {formatNumberWithCommas(item.price)}VND</div>
            {/* Item Quantity */}
            <div>Qty-{item.quantity}</div>
          </div>
        </div>
      </div>
      <div className="w-36">
        {/* Item Total */}
        <div className={`flex flex-col items-end font-bold`}>
          <span>Total</span>
          <span>{formatNumberWithCommas(item.price * item.quantity)}VND</span>
        </div>
      </div>
    </div>
  )
}

const OrderViews = ({ order }: { order: any }) => {
  const { loading } = useLoading()
  return (
    <div
      className={clsx('p-2 mb-3 block', order?.status === 'Canceled' && 'bg-gray-100 text-gray-300')}
    >
      {/* Oder Header Wrapper */}
      <Link
        href={`/admin/orders/${order.id}`}
        onClick={loading}
        className="flex bg-slate-100 border-2 rounded-tl-xl rounded-tr-xl p-3 justify-between hover:bg-gray-200"
      >
        <div className="flex items-center justify-between">
          <Avatar user={order?.user} />
          <span className="ml-4 font-semibold text-lg w-40 truncate">{order?.user?.name}</span>
        </div>

        <div className="ml-4 flex justify-between items-center">
          {/* Order Infor */}
          <div>
            <div className=" font-bold text-lg">
              {/* Order Date */}
              <div>{convertDate(order.createdAt)}</div>
            </div>
            <div className={`flex`}>
              {/* Order Count */}
              <div className={`pr-3`}>
                <span className={`uppercase text-sm  `}>item: </span>
                {order.orderItems.length}
              </div>
              {/* Order Total */}
              {/* upcase */}
              <div className={`pr-3`}>
                <span className={`uppercase text-sm `}>total: </span>
                {getTotal(order)}VND
              </div>
              {/* Order Status */}
            </div>
          </div>
        </div>
      </Link>
      {/* List items */}
      {/* <div className={` border-2 border-gray-300 `}> */}
      <div className={``}>
        <div className={`m-3 ml-36`}>
          {/* item  */}
          {order.orderItems.slice(0, 3).map((item: any) => (
            <div className={`border-l-2 border-b-2 border-gray-300 mb-1`} key={item.id}>
              <ItemViews item={item} />
            </div>
          ))}
          {order.orderItems.length > 3 && <div>...</div>}
        </div>
      </div>
    </div>
  )
}

export default OrderViews
