'use client'
import useLoading from '@/app/hooks/useLoading'
import clsx from 'clsx'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BiLaptop } from 'react-icons/bi'
import { GoListUnordered } from 'react-icons/go'
import { HiArrowLeftOnRectangle } from 'react-icons/hi2'
import { IoHomeOutline } from 'react-icons/io5'
import { TbCategory, TbPackageImport } from 'react-icons/tb'
const routes = [
  {
    label: 'Orders',
    href: '/admin/orders',
    icon: <GoListUnordered className="h-6 w-6 shrink-0" />,
  },
  {
    label: 'Categories',
    href: '/admin/categories',
    icon: <TbCategory className="h-6 w-6 shrink-0" />,
  },
  {
    label: 'Products',
    href: '/admin/products',
    icon: <BiLaptop className="h-6 w-6 shrink-0" />,
  },
  {
    label: 'Imports',
    href: '/admin/imports',
    icon: <TbPackageImport className="h-6 w-6 shrink-0" />,
  },
]

const SideBar = () => {
  const pathname = usePathname()
  const { loading } = useLoading()
  const handleClick = (href: string) => {
    if (pathname !== href) loading()
  }
  return (
    <>
      <aside
        id="logo-sidebar"
        className="
            relative
            inset-y-0
            w-0
            lg:w-[18rem]
            transition-all
            overflow-y-auto
            border
            border-gray-200
            rounded-lg
            bg-gray-50
            shadow-sm
      "
        aria-label="Sidebar"
      >
        <div className="relative flex flex-col h-full px-3 py-4 overflow-y-auto bg-gray-50">
          <ul className="space-y-3 font-medium mt-6 lg:mt-9">
            <Link
              href="/admin"
              onClick={() => handleClick('/admin')}
              className={clsx(
                'w-full flex p-4 border-t-[1px] transition-all border-gray-200 text-neutral-700 hover:text-neutral-900 hover:bg-gray-200 hover:rounded-md justify-center lg:justify-start',
                pathname === '/admin' && 'bg-gray-100 text-neutral-900',
              )}
            >
              <IoHomeOutline className="h-6 w-6 shrink-0" />
              <text className="hidden lg:block ml-2 text-ellipsis text-nowrap">Home</text>
            </Link>
            {routes.map(item => (
              <Link
                href={item.href}
                onClick={() => handleClick(item.href)}
                className={clsx(
                  'w-full flex p-4 border-t-[1px] transition-all border-gray-200 text-neutral-700 hover:text-neutral-900 hover:bg-gray-200 hover:rounded-md justify-center lg:justify-start',
                  pathname.includes(item.href) && 'bg-gray-100 text-neutral-900',
                )}
                key={item.label}
              >
                {item.icon}
                <text className="hidden lg:block ml-2 text-ellipsis text-nowrap">{item.label}</text>
              </Link>
            ))}
          </ul>
          <button
            onClick={async () => {
              loading()
              await signOut()
            }}
            className="absolute bottom-2 left-2 right-2 p-2 flex items-center text-gray-900 rounded-lg"
          >
            <HiArrowLeftOnRectangle className="h-6 w-6 shrink-0" />
            <text className="hidden lg:block ml-2">Logout</text>
          </button>
        </div>
      </aside>
    </>
  )
}

export default SideBar
