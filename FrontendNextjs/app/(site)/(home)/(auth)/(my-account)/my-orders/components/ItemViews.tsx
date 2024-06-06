'use client'

import Image from 'next/image'
import Link from 'next/link'

const formatNumberWithCommas = (number: any) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const ItemViews = ({ item }: { item: any }) => {
  return (
    <div className="rounded-md p-2 mb-3 flex justify-between items-center">
      {/* Item Image */}
      <div className="flex">
        <div className={`mr-2`}>
          <Image
            width={200}
            height={200}
            alt="image"
            className="w-16 h-16"
            src={String(item?.product?.images[0])}
          />
        </div>
        {/* Item Header Wrapper */}
        <div className="">
          <Link
            className={`font-bold text-md text-slate-500`}
            href={`/products/${item?.product?.id}`}
          >
            {item.product.name}
          </Link>
          <div>Price: {formatNumberWithCommas(item.price)}VND</div>
          {/* Item Quantity */}
          <div>Qty-{item.quantity}</div>
        </div>
      </div>
      <div>
        {/* Item Total */}
        <div className={`flex flex-col text-slate-600 items-end font-bold`}>
          <span>Total</span>
          <span>{formatNumberWithCommas(item.price * item.quantity)}VND</span>
        </div>
      </div>
    </div>
  )
}

export default ItemViews
