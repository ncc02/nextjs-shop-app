'use client'

import clsx from 'clsx'
import { memo } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa6'

interface NumberInputProps {
  className?: string
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

const NumberInput = ({ className, value, onChange, disabled }: NumberInputProps) => {
  return (
    <div
      className={clsx(
        'flex w-full justify-between items-center px-2 py-1 border-2 border-black rounded-md ',
        disabled && 'border-gray-400',
        className,
      )}
    >
      <button
        onClick={() => {
          if (disabled) return
          onChange(value - 1)
        }}
      >
        <FaMinus />
      </button>
      <input
        disabled={disabled}
        className="bg-inherit block w-8/12 outline-none text-end pr-2"
        value={value}
        onChange={e => {
          if (Number.isInteger(e.target.value)) onChange(Number.parseInt(e.target.value))
        }}
      />
      <button
        onClick={() => {
          if (disabled) return
          onChange(value + 1)
        }}
      >
        <FaPlus />
      </button>
    </div>
  )
}

export default memo(NumberInput)
