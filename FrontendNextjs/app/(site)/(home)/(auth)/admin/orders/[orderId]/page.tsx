'use client'

import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { CiPhone } from 'react-icons/ci'
const MyOrder = ({ params }: { params: { orderId: string } }) => {
  const [orderInfor, setOrderInfor] = useState<any>()
  const [status, setStatus] = useState<string>('')
  useEffect(() => {
    const getData = async () => {
      const data = await axios.get(`/api/orders/${params.orderId}`)
      if (data.data.success) {
        setOrderInfor(data.data.data)
        setStatus(data.data.data.status)
      }
    }
    getData()
  }, [params.orderId])

  const formatDate = (date: string) => {
    const dateObject = new Date(date)
    const day = dateObject.getUTCDate()
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(dateObject)
    const year = dateObject.getUTCFullYear()
    const hour = dateObject.getUTCHours()
    const minute = dateObject.getUTCMinutes()
    const period = hour < 12 ? 'AM' : 'PM'

    const daySuffix = day > 10 && day < 20 ? 'th' : ['th', 'st', 'nd', 'rd', 'th'][day % 10]

    const result =
      day +
      daySuffix +
      ' ' +
      month +
      ' ' +
      year +
      ' at ' +
      (hour % 12 || 12) +
      ':' +
      (minute < 10 ? '0' : '') +
      minute +
      ' ' +
      period

    return result
  }

  const calculateTotal = () => {
    let subtotal = 0

    orderInfor.orderItems.forEach((orderItem: any) => {
      subtotal += orderItem.price * orderItem.quantity
    })

    return subtotal
  }

  const handleCancel = async () => {
    await axios.patch(`/api/orders/${params.orderId}`)
    toast.success('Cancellation successful')
    setStatus('Canceled')
  }
  return (
    orderInfor && (
      <div className="py-14  2xl:container 2xl:mx-auto">
        <div className="flex justify-start item-start space-y-2 flex-col">
          <h1 className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">
            Order #1{params.orderId}
          </h1>
          <div className="flex items-center gap-6 justify-between">
            <p className="text-base font-medium leading-6 text-gray-600">
              {formatDate(orderInfor.createdAt)}
            </p>
            <div className="flex items-center gap-4">
              <div>
                Status:{' '}
                <span
                  className={`${status === 'Canceled' ? 'bg-red-400' : 'bg-green-500'}
                 text-white py-2 px-4 rounded text-base font-medium leading-6`}
                >
                  {status === 'Canceled' ? 'Canceled' : 'Confirmed'}
                </span>
              </div>
              <p className="text-base font-medium leading-6 text-gray-600">Action: </p>
              <button
                disabled={status === 'Canceled'}
                onClick={handleCancel}
                className={`bg-red-400 ${status == 'Canceled' ? 'bg-red-100' : 'bg-red-400'}
                 text-white py-2 px-4 rounded text-base font-medium leading-6`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
          <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
            <div className="flex flex-col justify-start items-start bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
              <p className="text-lg md:text-xl  font-semibold leading-6 xl:leading-5 text-gray-800">
                Customer’s Cart
              </p>
              {orderInfor.orderItems.map((orderItem: any) => (
                <div
                  key={orderItem.id}
                  className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full"
                >
                  <div className="pb-4 md:pb-8 w-full md:w-40">
                    <Image
                      className="w-full hidden md:block"
                      src={orderItem.product.images[0]}
                      alt="dress"
                      width={200}
                      height={200}
                    />
                    <Image
                      className="w-full md:hidden"
                      src={orderItem.product.images[0]}
                      alt="dress"
                      width={200}
                      height={200}
                    />
                  </div>
                  <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
                    <div className="w-full flex flex-col justify-start items-start space-y-8">
                      <Link
                        href={`/products/${orderItem.productId}`}
                        className="text-xl  xl:text-2xl font-semibold leading-6 text-gray-700 hover:text-gray-950 cursor-pointer"
                      >
                        {orderItem.product.name}
                      </Link>
                      <div className="flex justify-start items-start flex-col space-y-2"></div>
                    </div>
                    <div className="flex justify-between space-x-8 items-start w-full">
                      <p className="text-base  xl:text-lg leading-6">
                        {Math.floor(orderItem.price).toLocaleString('en-US')} VND
                      </p>
                      <p className="text-base  xl:text-lg leading-6 text-gray-800">
                        {orderItem.quantity}
                      </p>
                      <p className="text-base  xl:text-lg font-semibold leading-6 text-gray-800">
                        {Math.floor(orderItem.price * orderItem.quantity).toLocaleString('en-US')}{' '}
                        VND
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
              <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50  space-y-6">
                <h3 className="text-xl  font-semibold leading-5 text-gray-800">Summary</h3>
                <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                  <div className="flex justify-between w-full">
                    <p className="text-base  leading-4 text-gray-800">Subtotal</p>
                    <p className="text-base  leading-4 text-gray-600">
                      {Math.floor(calculateTotal()).toLocaleString('en-US')} VND
                    </p>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <p className="text-base  leading-4 text-gray-800">Discount </p>
                    <p className="text-base  leading-4 text-gray-600">0 VND</p>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <p className="text-base  leading-4 text-gray-800">Shipping</p>
                    <p className="text-base  leading-4 text-gray-600">23,000 VND</p>
                  </div>
                </div>
                <div className="flex justify-between items-center w-full">
                  <p className="text-base  font-semibold leading-4 text-gray-800">Total</p>
                  <p className="text-base  font-semibold leading-4 text-gray-600">
                    {Math.floor(calculateTotal() + 23000).toLocaleString('en-US')} VND
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50  space-y-6">
                <h3 className="text-xl  font-semibold leading-5 text-gray-800">Shipping</h3>
                <div className="flex justify-between items-start w-full">
                  <div className="flex justify-center items-center space-x-4">
                    <div className="w-8 h-8">
                      <Image
                        className="w-full h-full"
                        alt="logo"
                        src="https://i.ibb.co/L8KSdNQ/image-3.png"
                        width={50}
                        height={50}
                      />
                    </div>
                    <div className="flex flex-col justify-start items-center">
                      <p className="text-lg leading-6  font-semibold text-gray-800">
                        DPD Delivery
                        <br />
                        <span className="font-normal">Delivery with 24 Hours</span>
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold leading-6  text-gray-800">23,000 VND</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50  w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
            <h3 className="text-xl  font-semibold leading-5 text-gray-800">Customer Detail</h3>
            <div className="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
              <div className="flex flex-col justify-start items-start flex-shrink-0">
                <div className="flex justify-center text-gray-800  md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                  <CiPhone />
                  <p className="cursor-pointer text-sm leading-5 ">{orderInfor.phone}</p>
                </div>
              </div>
              <div className="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-0">
                <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row items-center md:items-start">
                  <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
                    <p className="text-base  font-semibold leading-4 text-center md:text-left text-gray-800">
                      Shipping Address
                    </p>
                    <p className="w-48 lg:w-full  xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                      {orderInfor.address}
                    </p>
                  </div>
                  <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4">
                    <p className="text-base  font-semibold leading-4 text-center md:text-left text-gray-800">
                      Billing Address
                    </p>
                    <p className="w-48 lg:w-full  xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                      {orderInfor.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  )
}

export default MyOrder
