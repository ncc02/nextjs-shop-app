'use client'

import clsx from 'clsx'
import { memo } from 'react'

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
  children?: React.ReactNode
  onClick?: () => void
  secondary?: boolean
  danger?: boolean
  disabled?: boolean
}

const Button = ({
  onClick,
  type,
  disabled,
  fullWidth,
  secondary,
  danger,
  children,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={clsx(
        `flex
                justify-center
                items-center
                rounded-md
                px-3
                py-2
                text-sm
                select-none
                font-semibold
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2`,
        disabled && 'opacity-50 cursor-default',
        fullWidth && 'w-full',
        secondary ? 'text-gray-800 hover:text-black' : 'text-white',
        danger && 'bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600',
        !secondary && !danger && 'bg-slate-950 hover:bg-gray-900 focus-visible:outline-slate-900',
      )}
    >
      {children}
    </button>
  )
}

export default memo(Button)
