'use client'

import Button from '@/app/(site)/components/Button'
import useCart from '@/app/hooks/useCart'
import useLoading from '@/app/hooks/useLoading'
import { PublicUserType } from '@/app/types'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import AddressModal from './UpdateInfoModal'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const Checkout = ({ user }: { user?: PublicUserType | null }) => {
  const { loading, unLoading } = useLoading()
  const { cart, set } = useCart()
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const total = useMemo(() => {
    return cart.reduce((prev, cur) => {
      return prev + cur.productPrice * cur.quantity
    }, 0)
  }, [cart])
  const onCheckout = async () => {
    if (!user?.address || !user.phoneNumber) {
      setModalOpen(true)
      return
    }
    loading()
    try {
      // loop and post to collect
      Promise.all(
        cart.map(item =>
          axios.post('/api/collect', {
            type: 'Buy',
            productId: item.productId,
          }),
        ),
      )

      await axios.post('api/orders')
      set([])
      toast.success('Buy successfully!')
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    }
    unLoading()
  }

  return (
    <div className="ml-6 p-2 mt-8 w-full lg:w-1/3 flex flex-col gap-2 divide-y border rounded-md">
      <h5 className="font-semibold p-2">Summary</h5>
      <div className="flex justify-between p-2 divide-x">
        <p>Delivery charge</p>
        <p className="text-end pl-6">$0</p>
      </div>
      <div className="flex justify-between p-2 divide-x mb-4">
        <p className="font-semibold ">Grand Total</p>
        <p className="font-semibold text-end pl-6">${total}</p>
      </div>
      {user?.email ? (
        <Button onClick={onCheckout}>
          <p className="my-1">Checkout</p>
        </Button>
      ) : (
        <Button onClick={loading}>
          <Link href={'/login'} className="my-1">
            Login to checkout
          </Link>
        </Button>
      )}
      <AddressModal isOpen={modalOpen} userName={user?.name!} onClose={() => setModalOpen(false)} />
    </div>
  )
}

export default Checkout
