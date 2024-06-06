'use client'

import Link from 'next/link'
import Avatar from '../../components/Avatar'
import { FaShoppingCart } from 'react-icons/fa'
import useLoading from '@/app/hooks/useLoading'
import Button from '../../components/Button'
import { usePathname, useRouter } from 'next/navigation'
import clsx from 'clsx'
import { CartItem, SessionUser } from '@/app/types'
import { useEffect } from 'react'
import useCart from '@/app/hooks/useCart'

interface HeaderProps {
  user?: SessionUser
  cartItems?: CartItem[]
}

const Header = ({ user, cartItems }: HeaderProps) => {
  const { loading, unLoading } = useLoading()
  const { cart, set } = useCart()
  const router = useRouter()
  const pathName = usePathname()
  useEffect(() => {
    unLoading()
  }, [pathName, unLoading])
  useEffect(() => {
    if (cartItems) {
      set(cartItems)
      return
    }
    try {
      const cartLocal = JSON.parse(localStorage.getItem('cart') || '')
      if (cartLocal) set(cartLocal)
    } catch (error) {}
  }, [set, cartItems])
  return (
    <header className="flex justify-between items-center pt-4 pb-2 shadow-sm bg-gray-50 px-6 md:px-24 gap-4">
      <Link href={'/'} onClick={loading}>
        <h1 className="text-2xl font-bold text-sky-600">Shop app</h1>
      </Link>
      <div className="flex">
        <Link
          href="/"
          onClick={loading}
          className={clsx(
            'p-2 rounded-md text-md text-gray-800 align-middle hover:text-gray-900 my-auto hover:bg-neutral-100',
            pathName === '/' && 'text-gray-900 bg-neutral-200',
          )}
        >
          Home
        </Link>
        <Link
          href="/products"
          onClick={loading}
          className={clsx(
            'p-2 rounded-md text-md text-gray-800 align-middle hover:text-gray-900 my-auto hover:bg-neutral-100',
            pathName.includes('/products') && 'text-gray-900 bg-neutral-200',
          )}
        >
          Shop
        </Link>
        <Link
          href="/cart"
          onClick={loading}
          className={clsx(
            'relative p-2 rounded-md text-md text-gray-800 align-middle hover:text-gray-900 my-auto hover:bg-neutral-100',
            pathName.includes('/cart') && 'text-gray-900 bg-neutral-200',
          )}
        >
          <FaShoppingCart size="18" />
          <span className="absolute top-[-2px] right-[-2px] text-sm">{cart.length}</span>
        </Link>
        <div className="mx-4 my-auto">
          {user ? (
            <Link href={'/personal-info'} className="my-auto" onClick={loading}>
              <Avatar user={user} />
            </Link>
          ) : (
            <Button
              onClick={() => {
                router.push('/login')
                loading()
              }}
            >
              Login
            </Button>
          )}
        </div>
        {user?.role === 'admin' && (
          <Link
            href="/admin"
            onClick={loading}
            className={clsx(
              'p-2 rounded-md text-md text-gray-800 align-middle hover:text-gray-900 my-auto hover:bg-neutral-100',
              pathName.includes('/admin') && 'text-gray-900 bg-neutral-200',
            )}
          >
            Manage
          </Link>
        )}
      </div>
    </header>
  )
}

export default Header
