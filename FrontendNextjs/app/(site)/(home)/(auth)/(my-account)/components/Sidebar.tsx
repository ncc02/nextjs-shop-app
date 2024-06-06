'use client'

import Avatar from '@/app/(site)/components/Avatar'
import useLoading from '@/app/hooks/useLoading'
import { SessionUser } from '@/app/types'
import clsx from 'clsx'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HiArrowLeftOnRectangle, HiOutlineCreditCard } from 'react-icons/hi2'
import { LuUser2 } from 'react-icons/lu'

interface SiderProps {
  user: SessionUser
}

const routes = [
  {
    label: 'Personal information',
    href: '/personal-info',
    icon: <LuUser2 className="h-6 w-6 shrink-0" />,
  },
  {
    label: 'My orders',
    href: '/my-orders',
    icon: <HiOutlineCreditCard className="h-6 w-6 shrink-0" />,
  },
]

const Sidebar = ({ user }: SiderProps) => {
  const { loading } = useLoading()
  const pathname = usePathname()
  const handleClick = (href: string) => {
    if (pathname !== href) loading()
  }
  return (
    <aside
      className={`
            relative
            inset-y-0
            w-[5rem]
            lg:w-[20rem]
            transition-all
            block
            overflow-y-auto
            border
            border-gray-200
            rounded-lg
            bg-gray-50
            shadow-sm
            `}
    >
      <div className="flex p-4 transition-all justify-center lg:justify-start">
        <div>
          <Avatar user={user!} />
        </div>
        <div className="flex-col ml-2 hidden lg:flex">
          <text>{user.name}</text>
          <text className="text-ellipsis text-nowrap text-xs">{user.email}</text>
        </div>
      </div>
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
      <div className="w-full flex p-4 border-t-[1px]"></div>
      <button
        onClick={async () => {
          loading()
          await signOut()
        }}
        className="w-full absolute bottom-0 flex p-4 border-t-[1px] border-gray-200 text-neutral-700 hover:text-neutral-900 hover:bg-gray-200 hover:rounded-md justify-center lg:justify-start"
      >
        <HiArrowLeftOnRectangle className="h-6 w-6 shrink-0" />
        <text className="hidden lg:block ml-2">Logout</text>
      </button>
    </aside>
  )
}

export default Sidebar
